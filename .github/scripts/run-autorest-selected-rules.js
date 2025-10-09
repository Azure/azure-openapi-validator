#!/usr/bin/env node
"use strict";

/*
AutoRest Selected Rules Runner
Runs only specified Azure OpenAPI Validator / Spectral rules against filtered ARM spec files.

Environment Variables:
  RULE_NAMES   (required) Comma-separated rule names
  SPEC_ROOT    (required) Path to azure-rest-api-specs checkout
  OUTPUT_FILE  (optional) Path to write collected output
  MAX_FILES    (optional) Safety cap (default 100)
  ALLOWED_RPS  (optional) Comma list of RPs (default network,compute,monitor,sql,hdinsight,resource,storage)
*/

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function env(name, def='') { return (process.env[name]||'').trim() || def; }
const RAW_RULE_NAMES = env('RULE_NAMES');
const SPEC_ROOT = env('SPEC_ROOT');
const OUTPUT_FILE = env('OUTPUT_FILE');
const MAX_FILES = parseInt(env('MAX_FILES')||'100',10);
const ALLOWED_RPS = (env('ALLOWED_RPS')||'network,compute,monitor,sql,hdinsight,resource,storage')
  .split(',').map(s=>s.trim()).filter(Boolean);

if (!SPEC_ROOT) { console.error('ERROR | Runner | config | SPEC_ROOT required'); process.exit(1); }
if (!RAW_RULE_NAMES) {
  console.log('INFO | Runner | rules | No RULE_NAMES specified; exiting.');
  if (OUTPUT_FILE) fs.writeFileSync(OUTPUT_FILE,'INFO | Runner | summary | Files scanned: 0, Errors: 0, Warnings: 0\n');
  process.exit(0);
}
const SELECTED_RULES = RAW_RULE_NAMES.split(',').map(r=>r.trim()).filter(Boolean);
console.log(`INFO | Runner | config | Selected rules: ${SELECTED_RULES.join(', ')}`);

function walk(dir, cb) {
  let entries; try { entries = fs.readdirSync(dir,{withFileTypes:true}); } catch { return; }
  for (const e of entries) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) { const r = walk(fp, cb); if (r==='STOP') return 'STOP'; }
    else if (e.isFile()) { const r = cb(fp); if (r==='STOP') return 'STOP'; }
  }
}

function collectSpecs() {
  const out = [];
  for (const rp of ALLOWED_RPS) {
    const base = path.join(SPEC_ROOT,'specification',rp);
    if (!fs.existsSync(base)) continue;
    const stop = walk(base, file => {
      const lc = file.toLowerCase();
      if (!lc.endsWith('.json')) return;
      const norm = file.replace(/\\/g,'/');
      if (!/\/resource-manager\//.test(norm)) return;
      if (!/\/stable\//.test(norm)) return;
      out.push(file);
      if (out.length >= MAX_FILES) return 'STOP';
    });
    if (stop==='STOP') break;
    if (out.length >= MAX_FILES) break;
  }
  return out;
}

function getAllRuleNames() {
  try {
    const dist = path.join(process.cwd(),'packages','rulesets','dist');
    const mod = require(dist);
    const spectralRulesets = mod.spectralRulesets || (mod.default && mod.default.spectralRulesets) || mod;
    const names = Object.keys(spectralRulesets?.azARM?.rules || {});
    console.log(`INFO | Runner | rules | Found ${names.length} rules in built ruleset.`);
    return names;
  } catch (e) {
    console.log(`WARN | Runner | rules | Could not load built ruleset: ${e.message}`);
    return [];
  }
}

function runAutorest(specPath) {
  const start = Date.now();
  const rel = path.relative(SPEC_ROOT, specPath).replace(/\\/g,'/');
  const args = [ 'exec','--','autorest',
    '--level=warning','--v3','--spectral','--azure-validator',
    '--semantic-validator=false','--model-validator=false',
    '--openapi-type=arm','--openapi-subtype=arm','--message-format=json',
    `--use=${path.join(process.cwd(),'packages','azure-openapi-validator','autorest')}`,
    `--input-file=${specPath}` ];
  const res = spawnSync('npm', args, {encoding:'utf8', shell:true});
  const dur = Date.now()-start;
  if (res.error) console.log(`DEBUG | runAutorest | error | ${rel} ${res.error.message} (${dur}ms)`);
  else console.log(`DEBUG | runAutorest | end | ${rel} status=${res.status} (${dur}ms)`);
  return res;
}

function parseMessages(stdout, stderr) {
  const msgs = [];
  (stdout+'\n'+stderr).split(/\r?\n/).forEach(line => {
    if (!line.includes('"extensionName":"@microsoft.azure/openapi-validator"')) return;
    const i = line.indexOf('{'); if (i<0) return;
    try { msgs.push(JSON.parse(line.slice(i))); } catch {}
  });
  return msgs;
}

function main() {
  const specs = collectSpecs();
  if (!specs.length) {
    console.log('WARN | Runner | input | No matching spec files found.');
    if (OUTPUT_FILE) fs.writeFileSync(OUTPUT_FILE,'INFO | Runner | summary | Files scanned: 0, Errors: 0, Warnings: 0\n');
    return;
  }
  console.log(`INFO | Runner | specs | Processing ${specs.length} file(s)`);

  const allNames = getAllRuleNames();
  if (allNames.length) {
    const unknown = SELECTED_RULES.filter(r=>!allNames.includes(r));
    if (unknown.length) console.log('WARN | Runner | validation | Unknown selected rules:', unknown.join(','));
    else console.log('INFO | Runner | validation | All selected rules are known');
  } else {
    console.log('INFO | Runner | validation | Using runtime rule discovery');
  }

  let errors = 0, warnings = 0; const outLines = [];
  for (const spec of specs) {
    const res = runAutorest(spec);
    if (res.error) { console.log(`WARN | Runner | autorest | Failed ${spec}: ${res.error.message}`); continue; }
    const messages = parseMessages(res.stdout||'', res.stderr||'');
    console.log(`WARN | Runner | autorest | Found ${spec}: ${messages.length} issues.`);
  
    for (const m of messages) {
      const code = m.code || m.id || 'Unknown';
      if (!SELECTED_RULES.includes(code)) continue;
      const level = (m.level||'').toLowerCase();
      const sev = level==='error' ? 'ERROR' : (level==='warning' ? 'WARN' : 'INFO');
      if (sev==='ERROR') errors++; else if (sev==='WARN') warnings++;
      const src = String(m.file||m.source||'').replace(/\\/g,'/');
      const loc = m.line!=null ? `${m.line}:${m.column!=null?m.column:1}` : '';
      const jp = m.jsonpath ? (Array.isArray(m.jsonpath)?m.jsonpath.join('.') : m.jsonpath) : '';
      outLines.push(`${sev} | ${code} | ${path.relative(SPEC_ROOT,spec).replace(/\\/g,'/')}${src? ' -> '+src : ''}${loc? ':'+loc:''}${jp? ' @ '+jp:''} | ${m.message||''}`.trim());
    }
  }
  outLines.forEach(l=>console.log(l));
  const summary = `INFO | Runner | summary | Files scanned: ${specs.length}, Errors: ${errors}, Warnings: ${warnings}`;
  console.log(summary);
  if (OUTPUT_FILE) {
    try { fs.mkdirSync(path.dirname(OUTPUT_FILE),{recursive:true}); fs.writeFileSync(OUTPUT_FILE, outLines.concat([summary]).join('\n')+'\n','utf8'); } catch {}
  }
}

try { main(); } catch (e) { console.error(e); process.exit(1); }
