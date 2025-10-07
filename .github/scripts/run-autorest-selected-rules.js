#!/usr/bin/env node
"use strict";
/*
Simplified AutoRest rule runner
--------------------------------
Runs selefunction runAutorest(specFile, suppressFile) {
  // In test mode, use simpler execution to avoid timeouts
  if (IN_TEST) {
    const args = [
      '--level=warning',
      '--v3',
      '--spectral',
      '--azure-validator',
      '--message-format=json',
      `--use=${path.join(process.cwd(),'packages','azure-openapi-validator','autorest')}`,
      `--config-file=${suppressFile}`,
      `--input-file=${specFile}`
    ];
    return spawnSync('autorest', args, { encoding:'utf8', shell:true, timeout: 15000 });
  }
  
  // Production mode - use npm exec for proper package resolution
  const args = [
    'exec','--','autorest',
    '--level=warning',
    '--v3',
    '--spectral',
    '--azure-validator',
    '--semantic-validator=false',
    '--model-validator=false',
    '--openapi-type=arm',
    '--openapi-subtype=arm',
    '--message-format=json',
    `--use=${path.join(process.cwd(),'packages','azure-openapi-validator','autorest')}`,
    `--config-file=${suppressFile}`,
    `--input-file=${specFile}`
  ];
  return spawnSync('npm', args, { encoding:'utf8', shell:true });
} Validator rules through AutoRest (production parity)
while keeping code small. We filter spec JSON files the same way as the earlier
custom Spectral runner: only JSON under specification/RP/resource-manager/stable
for an allowlist of RPs.

Env:
  RULE_NAMES       Comma-separated rule names (required)
  SPEC_ROOT        Path to azure-rest-api-specs checkout (required)
  OUTPUT_FILE      Optional output file
  FAIL_ON_ERRORS   true/false (default false)
  MAX_FILES        Safety cap (default 400)
  ALLOWED_RPS      Override list (default: network,compute,monitor,sql,hdinsight,resource,storage)

Strategy:
  1. Collect target spec files.
  2. Load all rule names; build a temporary suppression config (YAML) that suppresses every rule NOT in RULE_NAMES.
     (This keeps things simple—no wrapper package.)
  3. Invoke AutoRest once per spec file using --input-file and the suppression config.
  4. Parse validator JSON messages, keep only selected rules, aggregate summary.

Exit codes: 0 success, 2 errors (if FAIL_ON_ERRORS), 1 unexpected failure.
*/

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

function env(name, def='') { return (process.env[name]||'').trim() || def; }
const DESIRED_RULE_NAMES = env('RULE_NAMES');
const SPEC_ROOT = env('SPEC_ROOT');
const OUTPUT_FILE = env('OUTPUT_FILE');
const FAIL_ON_ERRORS = /^true$/i.test(env('FAIL_ON_ERRORS'));
const MAX_FILES = parseInt(env('MAX_FILES')||'100',10);
const ALLOWED_RPS = (env('ALLOWED_RPS')||'network,compute,monitor,sql,hdinsight,resource,storage').split(',').map(s=>s.trim()).filter(Boolean);

if (!SPEC_ROOT) { console.error('SPEC_ROOT required'); process.exit(1); }
if (!DESIRED_RULE_NAMES) {
  console.log('INFO | Runner | rules | No RULE_NAMES specified; nothing to run.');
  if (OUTPUT_FILE) fs.writeFileSync(OUTPUT_FILE,'INFO | Runner | summary | Files scanned: 0, Errors: 0, Warnings: 0\n');
  process.exit(0);
}
const SELECTED_RULES = DESIRED_RULE_NAMES.split(',').map(s=>s.trim()).filter(Boolean);

// 1. Collect spec files (JSON) matching filters
function collectSpecs() {
  const out = [];
  for (const rp of ALLOWED_RPS) {
    const base = path.join(SPEC_ROOT,'specification',rp);
    if (!fs.existsSync(base)) continue;
    walk(base, f => {
      const lower = f.toLowerCase();
      if (!lower.endsWith('.json')) return;
      const norm = f.replace(/\\/g,'/');
      if (!/\/resource-manager\//.test(norm)) return;
      if (!/\/stable\//.test(norm)) return;
      out.push(f);
      if (out.length >= MAX_FILES) return 'STOP';
    });
    if (out.length >= MAX_FILES) break;
  }
  return out;
}

function walk(dir, fileCb) {
  let ents; try { ents = fs.readdirSync(dir,{withFileTypes:true}); } catch { return; }
  for (const e of ents) {
    const p = path.join(dir,e.name);
    if (e.isDirectory()) { const r = walk(p,fileCb); if (r==='STOP') return 'STOP'; }
    else if (e.isFile()) { const r = fileCb(p); if (r==='STOP') return 'STOP'; }
  }
}

// 2. Build suppression config
function buildSuppressionFile() {
  let allRuleNames = [];
  try {
    // Attempt to load the rulesets from multiple candidate locations so we can
    // use the locally built package (monorepo) without requiring a published install.
    const candidates = [
      '@microsoft.azure/openapi-validator-rulesets',                            // normal resolution (installed dependency or NODE_PATH)
      path.join(process.cwd(), 'packages', 'rulesets', 'dist'),                 // built dist output
      path.join(process.cwd(), 'packages', 'rulesets')                          // source root (may export dist via main)
    ];
    let mod = null;
    for (const c of candidates) {
      try {
        mod = require(c);
        console.log(`INFO | Runner | rules | Loaded ruleset module from: ${c}`);
        break;
      } catch (_) { /* try next */ }
    }
    if (!mod) throw new Error('Unable to resolve ruleset module from candidates');

    // Support both named export and potential default nesting
    const spectralRulesets = mod.spectralRulesets || (mod.default && mod.default.spectralRulesets) || mod;
    console.log(`INFO | Runner | rules | Found ${spectralRulesets.length} spectralRulesets in total.`);
    allRuleNames = Object.keys(spectralRulesets?.azARM?.rules || {});
    console.log(`INFO | Runner | rules | Found ${allRuleNames.length} azARM/allRuleNames rules in total.`);
  } catch (e) {
    console.error('WARN | Runner | rules | Could not load full rule set:', e.message);
    // Fallback to common rules if package loading fails
    allRuleNames = ['PostResponseCodes', 'DeleteMustNotHaveRequestBody', 'GetResponseCodes', 'PutResponseCodes'];
  }
 
  const rulesToSuppress = allRuleNames.filter(r => !SELECTED_RULES.includes(r));
  console.log(`WARN | Runner | rules | Found ${rulesToSuppress.length} rulesToSuppress.`);
  const unknownRules = SELECTED_RULES.filter(r => !allRuleNames.includes(r));
  if (unknownRules.length) console.log('WARN | Runner | rules | Unknown rule names:', unknownRules.join(','));
  const lines = ['directive:'];
  for (const rule of rulesToSuppress) lines.push(`  - suppress: ${rule}`);
  const tmpPath = path.join(os.tmpdir(), `autorest-suppress-${Date.now()}.yaml`);
  fs.writeFileSync(tmpPath, lines.join('\n')+'\n','utf8');
  console.log(`WARN | Runner | rules | Successfully created ${tmpPath} suppression file.`);
  return tmpPath;
}

// 3. Run AutoRest per spec
function runAutorest(specFile, suppressFile) {
  const start = Date.now();
  const rel = SPEC_ROOT ? path.relative(SPEC_ROOT,specFile).replace(/\\/g,'/') : specFile;
  console.log(`DEBUG | runAutorest | start | ${rel}`);
  const args = [
    'exec','--','autorest',
    '--level=warning',
    '--v3',
    '--spectral',
    '--azure-validator',
    '--semantic-validator=false',
    '--model-validator=false',
    '--openapi-type=arm',
    '--openapi-subtype=arm',
    '--message-format=json',
    `--use=${path.join(process.cwd(),'packages','azure-openapi-validator','autorest')}`,
    `--config-file=${suppressFile}`,
    `--input-file=${specFile}`
  ];
  console.log(`DEBUG | runAutorest | cmd | npm ${args.join(' ')}`);
  const result = spawnSync('npm', args, { encoding:'utf8', shell:true });
  const dur = Date.now() - start;
  if (result.error) {
    console.log(`DEBUG | runAutorest | error | ${rel} ${result.error.message} (${dur}ms)`);
  } else {
    console.log(`DEBUG | runAutorest | end | ${rel} status=${result.status} (${dur}ms)`);
  }
  return result;
}

function parseMessages(stdout, stderr) {
  const acc = [];
  (stdout+'\n'+stderr).split(/\r?\n/).forEach(line => {
    if (!line.includes('"extensionName":"@microsoft.azure/openapi-validator"')) return;
    const i = line.indexOf('{'); if (i<0) return;
    try { const obj = JSON.parse(line.slice(i)); acc.push(obj); } catch {}
  });
  return acc;
}

function main() {
  const specs = collectSpecs();
  if (!specs.length) {
    console.log('WARN | Runner | input | No matching spec files found.');
    if (OUTPUT_FILE) fs.writeFileSync(OUTPUT_FILE,'INFO | Runner | summary | Files scanned: 0, Errors: 0, Warnings: 0\n');
    return;
  }
  console.log(`INFO | Runner | specs | Processing ${specs.length} file(s)`);
  
  // Build suppression file first (this validates rule names)
  const suppressFile = buildSuppressionFile();

  let errors=0, warns=0;
  const outLines=[];
  for (const spec of specs) {
    const res = runAutorest(spec, suppressFile);
    if (res.error) {
      console.log(`WARN | Runner | autorest | Failed ${spec}: ${res.error.message}`);
      continue;
    }
    const msgs = parseMessages(res.stdout||'', res.stderr||'');
    console.log(`WARN | Runner | autorest | Found ${spec}: ${msgs.length} issues.`);
    for (const m of msgs) {
      const code = m.code || m.id || 'Unknown';
      if (!SELECTED_RULES.includes(code)) continue; // Should already be suppressed otherwise
      const level = (m.level||'').toLowerCase();
      const sev = level==='error' ? 'ERROR' : (level==='warning'?'WARN':'INFO');
      if (sev==='ERROR') errors++; else if (sev==='WARN') warns++;
      const src = String(m.file||m.source||'').replace(/\\/g,'/');
      const loc = m.line!=null ? `${m.line}:${m.column!=null?m.column:1}` : '';
      const jp = m.jsonpath ? (Array.isArray(m.jsonpath)?m.jsonpath.join('.') : m.jsonpath) : '';
      outLines.push(`${sev} | ${code} | ${path.relative(SPEC_ROOT,spec).replace(/\\/g,'/')}${src? ' -> '+src : ''}${loc? ':'+loc:''}${jp? ' @ '+jp:''} | ${m.message||''}`.trim());
    }
  }
  outLines.forEach(l=>console.log(l));
  const summary = `INFO | Runner | summary | Files scanned: ${specs.length}, Errors: ${errors}, Warnings: ${warns}`;
  console.log(summary);
  if (OUTPUT_FILE) {
    try { fs.mkdirSync(path.dirname(OUTPUT_FILE),{recursive:true}); fs.writeFileSync(OUTPUT_FILE,outLines.concat([summary]).join('\n')+'\n','utf8'); } catch {}
  }
}

try { main(); } catch (e) { console.error(e); process.exit(1); }
