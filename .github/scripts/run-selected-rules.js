"use strict"

/*
Lightweight Spectral rules runner
---------------------------------
Purpose:
- Execute selected linter rules against a set of specs.

- Parses RULE_NAMES, SPEC_ROOT, FAIL_ON_ERRORS, MAX_FILES, OUTPUT_FILE from env.
- Loads the Spectral ARM ruleset from @microsoft.azure/openapi-validator-rulesets.
- Disables all rules except the requested ones.
- Walks SPEC_ROOT and only includes JSON specs under resource-manager/stable for selected RPs (network, compute, monitor, sql, hdinsight, resource, storage). EXCLUDE_DIRS is ignored for now.
- Runs Spectral and prints findings in a compact format.

Outputs:
- Console lines formatted as: "SEV | CODE | file[@path] | message".
- Optional OUTPUT_FILE with the same console lines plus a final summary line.
*/
const fs = require('fs')
const path = require('path')
// ============
// Env parsing
// ============

// Inputs
const RULE_NAMES = (process.env.RULE_NAMES || '').split(',').map(s => s.trim()).filter(Boolean)
const SPEC_ROOT = process.env.SPEC_ROOT || ''
const FAIL_ON_ERRORS = /^true$/i.test(process.env.FAIL_ON_ERRORS || 'false')
const OUTPUT_FILE = process.env.OUTPUT_FILE || ''
const MAX_FILES = parseInt(process.env.MAX_FILES || '20000', 10)
// Consider common test/debug environments to avoid hard exits during tests
const IN_TEST = !!(process.env.JEST_WORKER_ID || process.env.npm_lifecycle_event === 'test' || process.env.VSCODE_PID)

// Quick validation of required inputs
if (!SPEC_ROOT) {
  console.error('SPEC_ROOT not provided')
  process.exit(1)
}

// =====================
// Early-exit: no rules
// =====================
function writeNoRulesSummary() {
  if (!OUTPUT_FILE) return
  try {
    const dir = path.dirname(OUTPUT_FILE)
    fs.mkdirSync(dir, { recursive: true })
    const lines = [
      'INFO | Runner | rules | No rules specified; nothing to run.',
      'INFO | Runner | summary | Files scanned: 0, Errors: 0, Warnings: 0',
    ]
    fs.writeFileSync(OUTPUT_FILE, lines.join('\n') + '\n', 'utf8')
  } catch {}
}

// Early no-rules handling (write file + exit 0) before loading heavy deps
if (RULE_NAMES.length === 0) {
  writeNoRulesSummary()
  process.exit(0)
}

// ====================================
// Early-exit: all rules are unknown
// ====================================
function earlyExitUnknownRules(unknownList) {
  if (!OUTPUT_FILE) return false
  try {
    const dir = path.dirname(OUTPUT_FILE)
    fs.mkdirSync(dir, { recursive: true })
    const lines = [
      `WARN | Runner | rules | Unknown rule names: ${unknownList.join(', ')}`,
      'INFO | Runner | summary | Files scanned: 0, Errors: 0, Warnings: 0',
    ]
    fs.writeFileSync(OUTPUT_FILE, lines.join('\n') + '\n', 'utf8')
  } catch {}
  return true
}

// We need known rule names; gather them cheaply by requiring only the exported ruleset object
try {
  const { spectralRulesets } = require('@microsoft.azure/openapi-validator-rulesets')
  const tentative = spectralRulesets?.azARM?.rules ? Object.keys(spectralRulesets.azARM.rules) : []
  const unknown = RULE_NAMES.filter(n => !tentative.includes(n))
  if (tentative.length > 0 && unknown.length === RULE_NAMES.length) {
    earlyExitUnknownRules(unknown)
    process.exit(0)
  }
} catch {}

// ========================================
// Lazy load heavy deps and init Spectral
// ========================================
let Spectral = null
let Ruleset = null
let Resolver = null
let pathToFileURL = null
let spectralRulesets = null
let deleteRulesPropertiesInPayloadNotValidForSpectralRules = null
let disableRulesInRuleset = null
let spectral = null
let ruleset = null
let allRuleNames = []
let SPECTRAL_OK = true
let spectralInitError = null
let resolverInstance = null

try {
  ;({ Spectral, Ruleset } = require('@stoplight/spectral-core'))
  ;({ Resolver } = require('@stoplight/json-ref-resolver'))
  ;({ pathToFileURL } = require('url'))
  ;({ spectralRulesets, deleteRulesPropertiesInPayloadNotValidForSpectralRules, disableRulesInRuleset } = require('@microsoft.azure/openapi-validator-rulesets'))

  const rulesetPayload = spectralRulesets.azARM
  // Spectral Ruleset constructor requires disallowed props removed
  deleteRulesPropertiesInPayloadNotValidForSpectralRules(rulesetPayload)
  ruleset = new Ruleset(rulesetPayload)

  // Disable all rules, then keep only requested ones enabled
  allRuleNames = Object.keys(ruleset.rules)
  const namesToDisable = allRuleNames.filter(n => !RULE_NAMES.includes(n))
  disableRulesInRuleset(ruleset, namesToDisable)

  spectral = new Spectral()
  // Create a resolver instance and attach it depending on Spectral version
  resolverInstance = new Resolver()
  if (typeof spectral.setResolver === 'function') {
    try { spectral.setResolver(resolverInstance) } catch {}
  }
  spectral.setRuleset(ruleset)
} catch (e) {
  SPECTRAL_OK = false
  spectralInitError = e
}

// =====================
// Helpers (FS & paths)
// =====================

// Selected resource providers and path filter (resource-manager + stable)
const SELECTED_RPS = ['network', 'compute', 'monitor', 'sql', 'hdinsight', 'resource', 'storage']

function isAllowedSpecFile(filePath) {
  const p = filePath.replace(/\\/g, '/').toLowerCase()
  if (!p.endsWith('.json')) return false
  if (!p.includes('/resource-manager/')) return false
  if (!p.includes('/stable/')) return false
  const matchesRp = SELECTED_RPS.some(rp => p.includes(`/specification/${rp}/`))
  return matchesRp
}

function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      // Descend into all directories
      yield* walk(p)
    } else if (e.isFile()) {
      if (isAllowedSpecFile(p)) {
        yield p
      }
    }
  }
}

function ensureDirExists(filePath) {
  try {
    const dir = path.dirname(filePath)
    fs.mkdirSync(dir, { recursive: true })
  } catch {}
}

function writeOutputFile(lines) {
  if (!OUTPUT_FILE) return
  try {
    ensureDirExists(OUTPUT_FILE)
    fs.writeFileSync(OUTPUT_FILE, lines.join('\n') + '\n', 'utf8')
  } catch (e) {
    console.warn(`Failed to write OUTPUT_FILE (${OUTPUT_FILE}): ${e.message}`)
  }
}

// =====================
// Helpers (I/O & parse)
// =====================

function getSeverityLabel(severity) {
  // Spectral: 0=error, 1=warn, 2=info
  return severity === 0 ? 'error' : severity === 1 ? 'warn' : 'info'
}

function readSpecFile(file) {
  // Returns { ok: boolean, doc?: any, errorMsg?: string }
  try {
    const content = fs.readFileSync(file, 'utf8')
    return { ok: true, doc: JSON.parse(content) }
  } catch (e) {
    return { ok: false, errorMsg: `Skipping unreadable file: ${e.message}` }
  }
}

// ==============
// Main routine
// ==============
async function run() {
  let errorCount = 0
  let warnCount = 0
  let filesScanned = 0
  const lines = []
  const logLine = (s) => {
    console.log(s)
    lines.push(s)
  }

  // If Spectral failed to initialize, surface a clear warning to output
  if (!SPECTRAL_OK) {
    const msg = spectralInitError?.message || 'Unknown error'
    logLine(`WARN | Runner | spectral | Initialization failed: ${msg}`)
  }

  // Warn on unknown rule names
  const unknown = RULE_NAMES.filter(n => !allRuleNames.includes(n))
  if (unknown.length > 0) {
    logLine(`WARN | Runner | rules | Unknown rule names: ${unknown.join(', ')}`)
  }

  // Determine if SPEC_ROOT is a file or directory
  let rootStat = null
  try {
    rootStat = fs.statSync(SPEC_ROOT)
  } catch (e) {
    logLine(`WARN | Runner | input | SPEC_ROOT not found or unreadable: ${e.message}`)
    // Summary and graceful exit in tests
    lines.push(`INFO | Runner | summary | Files scanned: 0, Errors: 0, Warnings: 0`)
    writeOutputFile(lines)
    if (!IN_TEST) process.exit(1)
    return
  }

  const isSingleFile = rootStat.isFile()

  if (isSingleFile && !isAllowedSpecFile(SPEC_ROOT)) {
    logLine(`WARN | Runner | input | SPEC_ROOT is not an allowed spec (must be JSON in resource-manager/stable for selected RPs): ${SPEC_ROOT}`)
    lines.push(`INFO | Runner | summary | Files scanned: 0, Errors: 0, Warnings: 0`)
    writeOutputFile(lines)
    return
  }

  const iterator = isSingleFile ? [SPEC_ROOT] : walk(SPEC_ROOT)
  for (const file of iterator) {
    if (filesScanned >= MAX_FILES) {
      logLine(`WARN | Runner | summary | Reached MAX_FILES=${MAX_FILES}, stopping scan early`)
      break
    }
    filesScanned++
    const parsed = readSpecFile(file)
    if (!parsed.ok) {
      logLine(`WARN | Runner | ${file} | ${parsed.errorMsg}`)
      if (parsed.skipped) continue
      else continue
    }
    const doc = parsed.doc

    if (SPECTRAL_OK && spectral && pathToFileURL) {
      try {
        const resolveOpts = { documentUri: pathToFileURL(file).toString() }
        // For Spectral versions without setResolver, pass resolver inline
        if (resolverInstance && (!spectral.setResolver || typeof spectral.setResolver !== 'function')) {
          resolveOpts.resolver = resolverInstance
        }
        const results = await spectral.run(doc, { resolve: resolveOpts })
        const filtered = results.filter(r => RULE_NAMES.includes(r.code))
        if (filtered.length > 0) {
          for (const r of filtered) {
            const loc = r.path?.join('.') || ''
            const sev = getSeverityLabel(r.severity)
            logLine(`${sev.toUpperCase()} | ${r.code} | ${file}${loc ? ' @ ' + loc : ''} | ${r.message}`)
            if (r.severity === 0) errorCount++
            else if (r.severity === 1) warnCount++
          }
        }
      } catch (e) {
        logLine(`WARN | Runner | ${file} | Spectral failed: ${e.message}`)
      }
    }
  }
  // Summary
  lines.push(`INFO | Runner | summary | Files scanned: ${filesScanned}, Errors: ${errorCount}, Warnings: ${warnCount}`)
  writeOutputFile(lines)
  if (!IN_TEST && FAIL_ON_ERRORS && errorCount > 0) {
    console.error(`Found ${errorCount} error(s)`)
    process.exit(2)
  }
}

run().catch(e => {
  console.error(e)
  process.exit(1)
})
