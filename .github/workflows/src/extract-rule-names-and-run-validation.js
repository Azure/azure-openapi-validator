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
import { spawnSync } from 'node:child_process';

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
function runAutorest(specPath, specRoot, selectedRules) {
  const start = Date.now();
  const rel = path.relative(specRoot, specPath).replace(/\\/g, '/');
  const args = [
    'exec', '--', 'autorest',
    '--level=information','--v3','--spectral','--azure-validator',
    '--semantic-validator=false','--model-validator=false',
    '--openapi-type=arm','--openapi-subtype=arm','--message-format=json',
    // Pass selected rules down to the validator so only those rules execute inside the plugins.
    `--selected-rules=${selectedRules.join(',')}`,
    `--use=${path.join(process.cwd(), 'packages', 'azure-openapi-validator', 'autorest')}`,
    `--input-file=${specPath}`
  ];
  
  const result = spawnSync('npm', args, {encoding:'utf8', shell:true});
  
  const dur = Date.now() - start;
  console.log(`DEBUG | runAutorest | end | ${rel} status=${result.status} (${dur}ms)`);
  
  // Log raw output for debugging
  if (result.stdout) {
    console.log(`DEBUG | runAutorest | stdout for ${rel}:\n${result.stdout}`);
  }
  if (result.stderr) {
    console.log(`DEBUG | runAutorest | stderr for ${rel}:\n${result.stderr}`);
  }
  
  return { 
    stdout: result.stdout || '', 
    stderr: result.stderr || '', 
    status: result.status,
    error: result.error 
  };
}

/**
 * Parse AutoRest output for validation messages
 */
function parseMessages(stdout, stderr) {
  const msgs = [];
  const allOutput = stdout + '\n' + stderr;
  console.log(`DEBUG | parseMessages | Total output length: ${allOutput.length} characters`);
  
  let matchedLines = 0;
  let parsedCount = 0;
  
  allOutput.split(/\r?\n/).forEach((line, idx) => {
    if (!line.includes('"extensionName":"@microsoft.azure/openapi-validator"')) return;
    matchedLines++;
    console.log(`DEBUG | parseMessages | Line ${idx} matched extension filter`);
    
    const i = line.indexOf('{');
    if (i < 0) {
      console.log(`DEBUG | parseMessages | Line ${idx} has no opening brace`);
      return;
    }
    
    try { 
      const parsed = JSON.parse(line.slice(i));
      msgs.push(parsed);
      parsedCount++;
      console.log(`DEBUG | parseMessages | Line ${idx} parsed successfully - code: ${parsed.code || parsed.id}`);
    } catch (e) { 
      console.log(`DEBUG | parseMessages | Line ${idx} failed to parse: ${e.message}`);
    }
  });
  
  console.log(`DEBUG | parseMessages | Matched ${matchedLines} lines, parsed ${parsedCount} messages`);
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
  const specRoot = path.join(env.GITHUB_WORKSPACE || process.cwd(), env.SPEC_CHECKOUT_PATH || 'specs');
  const maxFiles = parseInt(env.MAX_FILES || '100', 10);
  const allowedRps = (env.ALLOWED_RPS || 'network,compute,monitor,sql,hdinsight,resource,storage')
    .split(',').map(s => s.trim()).filter(Boolean);
  const outputFile = path.join(env.GITHUB_WORKSPACE || process.cwd(), 'artifacts', 'linter-findings.txt');
  
  console.log(`Processing rules: ${selectedRules.join(', ')}`);
  console.log(`Max files: ${maxFiles}, Allowed RPs: ${allowedRps.join(', ')}`);
  console.log(`Spec root: ${specRoot}`);
  
  let specs;
  try {
    specs = await enumerateSpecs(specRoot, allowedRps, maxFiles);
  } catch (err) {
    const message = `Failed to enumerate specs: ${err.message}`;
    if (core) core.setFailed(message); else console.error(`ERROR | ${message}`);
    return;
  }
  if (!specs.length) {
    const message = 'No matching spec files found';
    if (core) core.warning(message);
    else console.log(`WARN | ${message}`);
    
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, 'INFO | Runner | summary | Files scanned: 0, Errors: 0, Warnings: 0\n');
    return;
  }
  
  console.log(`Processing ${specs.length} file(s)`);
  let errors = 0, warnings = 0;
  const outLines = [];
  
  // Process each spec file sequentially
  for (const spec of specs) {
    const res = runAutorest(spec, specRoot, selectedRules);
    if (res.error) {
      console.log(`Failed ${spec}: ${res.error.message}`);
      continue;
    }

    const messages = parseMessages(res.stdout || '', res.stderr || '');
    console.log(`Found ${messages.length} message(s) for ${path.relative(specRoot, spec).replace(/\\/g, '/')}`);
    
    for (const m of messages) {
      const code = m.code || m.id || 'Unknown';
      if (!selectedRules.includes(code)) continue;
      
      console.log(`DEBUG | Message object keys: ${Object.keys(m).join(', ')}`);
      console.log(`DEBUG | Message properties - line: ${m.line}, column: ${m.column}`);
      console.log(`DEBUG | Message range: ${JSON.stringify(m.range)}`);
      console.log(`DEBUG | Message position: ${JSON.stringify(m.position)}`);
      console.log(`DEBUG | Message source: ${JSON.stringify(m.source)}`);
      console.log(`DEBUG | Full message object: ${JSON.stringify(m, null, 2)}`);
      
      const level = (m.level || '').toLowerCase();
      const sev = level === 'error' ? 'ERROR' : (level === 'warning' ? 'WARN' : 'INFO');
      if (sev === 'ERROR') errors++;
      else if (sev === 'WARN') warnings++;
      
      const line = m.line ?? m.range?.start?.line ?? m.position?.line ?? undefined;
      const column = m.column ?? m.range?.start?.character ?? m.position?.character ?? undefined;
      const loc = line !== undefined ? `:${line}${column !== undefined ? `:${column}` : ''}` : '';
      
      console.log(`DEBUG | Extracted location - line: ${line}, column: ${column}, loc: '${loc}'`);
      
      outLines.push(`${sev} | ${code} | ${path.relative(specRoot, spec).replace(/\\/g, '/')}${loc} | ${m.message || ''}`.trim());
    }
  }
  
  // Output results
  outLines.forEach(l => console.log(l));
  const summary = `INFO | Runner | summary | Files scanned: ${specs.length}, Errors: ${errors}, Warnings: ${warnings}`;
  console.log(summary);
  
  // Write output file
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, outLines.concat([summary]).join('\n') + '\n', 'utf8');
  
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
