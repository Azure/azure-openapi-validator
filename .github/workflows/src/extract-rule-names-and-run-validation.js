#!/usr/bin/env node

/**
 * Extract rule names from GitHub PR and run AutoRest validation
 * 
 * This script combines rule extraction and AutoRest execution into a single operation.
 * It reads PR labels and body from GitHub context, extracts rule names, and runs
 * the selected rules against Azure REST API specs.
 * 
 * Usage in GitHub Actions:
 * Uses github-script action with direct access to context and core
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extract rule names from PR labels
 * Expects labels in format: test-<RuleName>
 * @param {string[]} labels - Array of label names
 * @returns {string[]} - Array of extracted rule names
 */
function extractRulesFromLabels(labels) {
  if (!Array.isArray(labels)) return [];
  // If labels are objects (GitHub API), map to their name first.
  const names = labels.map(l => (l && typeof l === 'object') ? l.name : l);
  return names
    .filter(name => typeof name === 'string' && /^test-/i.test(name))
    .map(name => name.replace(/^test-/i, '').trim())
    .filter(Boolean);
}

/**
 * Extract rule names from PR body
 * Parses lines matching pattern: rules: RuleName1, RuleName2
 * @param {string} body - PR body text
 * @returns {string[]} - Array of extracted rule names
 */
function extractRulesFromBody(body) {
  if (typeof body !== 'string') return [];
  // Find lines like "rules: A, B" or "rule: A"
  const matches = body.match(/^\s*rules?\s*:(.*)$/gim) || [];
  const ruleLine = matches
    .map(line => line.split(':')[1] || '')
    .join(',');
  return ruleLine
    .split(/[\n,]/)
    .map(s => s.trim())
    .filter(Boolean);
}

/**
 * Extract and combine rule names from GitHub context
 * Combines rules from both labels and body, removing duplicates
 * @param {Object} context - GitHub Actions context object
 * @returns {string[]} - Array of unique rule names
 */
function extractRuleNames(context) {
  const pr = context.payload.pull_request;
  if (!pr) return [];
  
  const fromLabels = extractRulesFromLabels(pr.labels || []);
  const fromBody = extractRulesFromBody(pr.body || '');

  // Combine both sources and remove duplicates
  const allRules = [...fromLabels, ...fromBody];
  return Array.from(new Set(allRules));
}

/**
 * Enumerate stable ARM swagger files.
 * Criteria: contains /resource-manager/ and /stable/, ends with .json.
 * Excludes examples, readme, quickstart-templates, scenarios.
 */
async function enumerateSpecs(specRoot, allowedRPs, maxFiles) {
  const results = [];
  const isStableArm = p => /\/resource-manager\//.test(p) && /\/stable\//.test(p);
  for (const rp of allowedRPs) {
    if (results.length >= maxFiles) break;
    const rpRoot = path.join(specRoot, 'specification', rp);
    if (!fs.existsSync(rpRoot)) continue;
    const stack = [rpRoot];
    while (stack.length && results.length < maxFiles) {
      const current = stack.pop();
      let entries; try { entries = fs.readdirSync(current, { withFileTypes: true }); } catch { continue; }
      for (const entry of entries) {
        const abs = path.join(current, entry.name);
        if (entry.isDirectory()) { stack.push(abs); continue; }
        if (!entry.isFile()) continue;
        if (!abs.toLowerCase().endsWith('.json')) continue;
        const norm = abs.replace(/\\/g, '/');
        if (!isStableArm(norm)) continue;
        if (/\/examples\//i.test(norm)) continue;
        if (/readme\.(md|json)$/i.test(norm)) continue;
        if (/quickstart-templates\//i.test(norm)) continue;
        if (/\/scenarios\//i.test(norm)) continue;
        results.push(abs);
        if (results.length >= maxFiles) break;
      }
    }
  }
  return results;
}

/**
 * Run AutoRest against a single specification file
 */
async function runAutorest(specPath, specRoot, selectedRules) {
  const { spawn } = await import('node:child_process');
  const start = Date.now();
  const rel = path.relative(specRoot, specPath).replace(/\\/g, '/');
  const args = [
    '--level=warning','--v3','--spectral','--azure-validator',
    '--semantic-validator=false','--model-validator=false',
    '--openapi-type=arm','--openapi-subtype=arm','--message-format=json',
    `--selected-rules=${selectedRules.join(',')}`,
    `--use=${path.join(process.cwd(), 'packages', 'azure-openapi-validator', 'autorest')}`,
    `--input-file=${specPath}`
  ];
  return await new Promise(resolve => {
    const proc = spawn('npx', ['-y','autorest', ...args], { cwd: process.cwd(), shell: false });
    let stdout = '', stderr = '';
    proc.stdout.on('data', d => { stdout += d.toString(); });
    proc.stderr.on('data', d => { stderr += d.toString(); });
    proc.on('close', code => {
      const dur = Date.now() - start;
      console.log(`DEBUG | runAutorest | end | ${rel} status=${code} (${dur}ms)`);
      resolve({ stdout, stderr, status: code });
    });
  });
}

/**
 * Parse AutoRest output for validation messages
 */
function parseMessages(stdout, stderr) {
  const msgs = [];
  (stdout + '\n' + stderr).split(/\r?\n/).forEach(line => {
    if (!line.includes('"extensionName":"@microsoft.azure/openapi-validator"')) return;
    const i = line.indexOf('{');
    if (i < 0) return;
    try { msgs.push(JSON.parse(line.slice(i))); } catch { }
  });
  return msgs;
}

/**
 * Main execution function for GitHub Actions
 * @param {object} context - GitHub Actions context
 * @param {object} core - GitHub Actions core utilities
 * @param {object} env - Environment variables
 */
async function runInGitHubActions(context, core, env = process.env) {
  try {
    // Extract rule names from PR
    const selectedRules = extractRuleNames(context);
    
    core.notice(`Selected Rules: ${selectedRules.length > 0 ? selectedRules.join(', ') : '<none>'}`);
    
    if (selectedRules.length === 0) {
      core.warning('No linting rules specified in labels or PR body');
      // Create empty output file
      const outputFile = path.join(env.GITHUB_WORKSPACE, 'artifacts', 'linter-findings.txt');
      fs.mkdirSync(path.dirname(outputFile), { recursive: true });
      fs.writeFileSync(outputFile, 'INFO | Runner | summary | Files scanned: 0, Errors: 0, Warnings: 0\n');
      return;
    }
    
    return await runValidation(selectedRules, env, core);
    
  } catch (error) {
    core.setFailed(`Script execution failed: ${error.message}`);
    throw error;
  }
}

/**
 * Core validation logic
 */
async function runValidation(selectedRules, env, core = null) {
  const SPEC_ROOT = path.join(env.GITHUB_WORKSPACE || process.cwd(), env.SPEC_CHECKOUT_PATH || 'specs');
  const MAX_FILES = parseInt(env.MAX_FILES || '100', 10);
  const ALLOWED_RPS = (env.ALLOWED_RPS || 'network,compute,monitor,sql,hdinsight,resource,storage')
    .split(',').map(s => s.trim()).filter(Boolean);
  const OUTPUT_FILE = path.join(env.GITHUB_WORKSPACE || process.cwd(), 'artifacts', 'linter-findings.txt');
  
  console.log(`Processing rules: ${selectedRules.join(', ')}`);
  console.log(`Max files: ${MAX_FILES}, Allowed RPs: ${ALLOWED_RPS.join(', ')}`);
  console.log(`Spec root: ${SPEC_ROOT}`);
  
  // Collect specs using SpecModel (no fallback)
  let specs;
  try {
    specs = await enumerateSpecs(SPEC_ROOT, ALLOWED_RPS, MAX_FILES);
  } catch (err) {
    const message = `Failed to enumerate specs: ${err.message}`;
    if (core) core.setFailed(message); else console.error(`ERROR | ${message}`);
    return;
  }
  if (!specs.length) {
    const message = 'No matching spec files found';
    if (core) core.warning(message);
    else console.log(`WARN | ${message}`);
    
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, 'INFO | Runner | summary | Files scanned: 0, Errors: 0, Warnings: 0\n');
    return;
  }
  
  console.log(`Processing ${specs.length} file(s)`);
  let errors = 0, warnings = 0;
  const outLines = [];
  
  // Process each spec file
  for (const spec of specs) {
    const res = await runAutorest(spec, SPEC_ROOT, selectedRules);
    if (res.error) {
      console.log(`Failed ${spec}: ${res.error.message}`);
      continue;
    }

    const messages = parseMessages(res.stdout || '', res.stderr || '');
    console.log(`Found ${messages.length} message(s) for ${path.relative(SPEC_ROOT, spec).replace(/\\/g, '/')}`);
    
    for (const m of messages) {
      const code = m.code || m.id || 'Unknown';
      if (!selectedRules.includes(code)) continue;
      
      const level = (m.level || '').toLowerCase();
      const sev = level === 'error' ? 'ERROR' : (level === 'warning' ? 'WARN' : 'INFO');
      if (sev === 'ERROR') errors++;
      else if (sev === 'WARN') warnings++;
      
      const line = m.line ?? m.range?.start?.line ?? m.position?.line ?? null;
      const column = m.column ?? m.range?.start?.character ?? m.position?.character ?? null;
      const loc = line != null ? `${line}:${column != null ? column : 1}` : '';
      const jp = m.jsonpath ? (Array.isArray(m.jsonpath) ? m.jsonpath.join('.') : m.jsonpath) : '';
      
      outLines.push(`${sev} | ${code} | ${path.relative(SPEC_ROOT, spec).replace(/\\/g, '/')}${loc ? ':' + loc : ''}${jp ? ' @ ' + jp : ''} | ${m.message || ''}`.trim());
    }
  }
  
  // Output results
  outLines.forEach(l => console.log(l));
  const summary = `INFO | Runner | summary | Files scanned: ${specs.length}, Errors: ${errors}, Warnings: ${warnings}`;
  console.log(summary);
  
  // Write output file
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, outLines.concat([summary]).join('\n') + '\n', 'utf8');
  
  // Handle failure conditions
  if (errors > 0 && env.FAIL_ON_ERRORS === 'true') {
    const message = `Found ${errors} error(s) in validation`;
    if (core) core.setFailed(message);
    else {
      console.error(`ERROR | ${message}`);
      process.exit(1);
    }
  }
  
  return { specs: specs.length, errors, warnings };
}

// Export functions for testing and GitHub Actions usage
export {
  extractRulesFromLabels,
  extractRulesFromBody,
  extractRuleNames,
  enumerateSpecs,
  parseMessages,
  runInGitHubActions,
  runValidation
};