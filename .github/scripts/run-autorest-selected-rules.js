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

/**
 * Check if a file path is a valid ARM spec
 */
function isArmSpec(filePath) {
  const lc = filePath.toLowerCase();
  if (!lc.endsWith('.json')) return false;
  const norm = filePath.replace(/\\/g,'/');
  if (!/\/resource-manager\//.test(norm)) return false;
  if (!/\/stable\//.test(norm)) return false;
  return true;
}

/**
 * Recursively walk directory tree
 */
function walk(dir, cb) {
  let entries; try { entries = fs.readdirSync(dir,{withFileTypes:true}); } catch { return; }
  for (const e of entries) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) { const r = walk(fp, cb); if (r==='STOP') return 'STOP'; }
    else if (e.isFile()) { const r = cb(fp); if (r==='STOP') return 'STOP'; }
  }
}

/**
 * Collect ARM spec files from specified resource providers
 */
function collectSpecs(specRoot, allowedRPs, maxFiles) {
  const out = [];
  for (const rp of allowedRPs) {
    const base = path.join(specRoot,'specification',rp);
    if (!fs.existsSync(base)) continue;
    const stop = walk(base, file => {
      if (!isArmSpec(file)) return;
      out.push(file);
      if (out.length >= maxFiles) return 'STOP';
    });
    if (stop==='STOP') break;
    if (out.length >= maxFiles) break;
  }
  return out;
}

function runAutorest(specPath, specRoot, selectedRules) {
  const start = Date.now();
  const rel = path.relative(specRoot, specPath).replace(/\\/g,'/');
  const args = [ 'exec','--','autorest',
    '--level=warning','--v3','--spectral','--azure-validator',
    '--semantic-validator=false','--model-validator=false',
    '--openapi-type=arm','--openapi-subtype=arm','--message-format=json',
    // Pass selected rules down to the validator so only those rules execute inside the plugins.
    `--selected-rules=${selectedRules.join(',')}`,
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
  // Read and validate environment variables
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
  console.log(`INFO | Runner | config | Max files: ${MAX_FILES}, Allowed RPs: ${ALLOWED_RPS.join(', ')}`);

  const specs = collectSpecs(SPEC_ROOT, ALLOWED_RPS, MAX_FILES);
  if (!specs.length) {
    console.log('WARN | Runner | input | No matching spec files found.');
    if (OUTPUT_FILE) fs.writeFileSync(OUTPUT_FILE,'INFO | Runner | summary | Files scanned: 0, Errors: 0, Warnings: 0\n');
    return;
  }
  console.log(`INFO | Runner | specs | Processing ${specs.length} file(s)`);

  let errors = 0, warnings = 0; const outLines = [];
  for (const spec of specs) {
    const res = runAutorest(spec, SPEC_ROOT, SELECTED_RULES);
    if (res.error) { console.log(`WARN | Runner | autorest | Failed ${spec}: ${res.error.message}`); continue; }
    const messages = parseMessages(res.stdout||'', res.stderr||'');
    console.log(`INFO | Runner | autorest | Found ${messages.length} message(s) for ${path.relative(SPEC_ROOT,spec).replace(/\\/g,'/')}`);
    
    // Log each message for debugging (skip "Unknown rule name" warnings from other plugin)
    messages.forEach((m, idx) => {
      const code = m.code || m.id || 'Unknown';
      const level = (m.level||'').toLowerCase();
      const msg = m.message || '';
      // Skip informational warnings about unknown rule names (cross-plugin noise)
      if (msg.includes('Unknown rule name')) return;
      console.log(`DEBUG | Runner | message[${idx}] | code=${code} level=${level} msg="${msg.substring(0,80)}${msg.length>80?'...':''}"`)
    });
  
    for (const m of messages) {
      const code = m.code || m.id || 'Unknown';
      if (!SELECTED_RULES.includes(code)) continue;
      const level = (m.level||'').toLowerCase();
      const sev = level==='error' ? 'ERROR' : (level==='warning' ? 'WARN' : 'INFO');
      if (sev==='ERROR') errors++; else if (sev==='WARN') warnings++;
      
      // Handle source file - may be string or object with path property
      const rawSrc = m.source || m.file || '';
      const src = (typeof rawSrc === 'string' ? rawSrc : (rawSrc.path || rawSrc.document || '')).replace(/\\/g, '/');
      
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

// Export functions for testing
module.exports = { isArmSpec, walk, collectSpecs, parseMessages };

// Only run main if executed directly
if (require.main === module) {
  try { main(); } catch (e) { console.error(e); process.exit(1); }
}
