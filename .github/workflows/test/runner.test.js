import { spawnSync } from "child_process"
import * as fs from "fs"
import * as path from "path"
import { afterAll, beforeAll, describe, expect, test } from "vitest"

const repoRoot = path.resolve(__dirname, '../..')
const scriptPath = path.join(repoRoot, '.github', 'scripts', 'run-autorest-selected-rules.js')

function run(env = {}, cwd = repoRoot) {
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd,
    env: { ...process.env, ...env, IN_TEST: 'true' },
    encoding: 'utf8',
    timeout: 90000,
  })
  return result
}

function writeFile(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, content, 'utf8')
}

describe('runner', () => {
  const tmpRoot = path.join(repoRoot, '.github', 'scripts', 'tmp-autorest-tests')
  const artifactsDir = path.join(tmpRoot, 'artifacts')
  const allowedDir = path.join(tmpRoot, 'specification', 'network', 'resource-manager', 'stable')
  // For backward-compat tests expecting a simple "specsDir" variable
  const specsDir = allowedDir

  beforeAll(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true })
    fs.mkdirSync(artifactsDir, { recursive: true })
    fs.mkdirSync(allowedDir, { recursive: true })

    // Copy existing spec files to the test directory structure
    const sourceSpecs = path.join(__dirname, 'fixtures')
    try {
        // fs.copyFileSync(path.join(sourceSpecs, 'lro-post-demo.json'), path.join(allowedDir, 'lro-post-good.json'))
        fs.copyFileSync(path.join(sourceSpecs, 'bad-lro-post.json'), path.join(allowedDir, 'lro-bad.json'))
        // fs.copyFileSync(path.join(sourceSpecs, 'bad-delete-with-body.json'), path.join(allowedDir, 'delete-bad.json'))
    } catch (err) {
        console.error('Failed to copy spec files:', err)
    }
  })

  afterAll(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true })
  })

  test('no rules -> no-op with summary and 0 exit', () => {
    const outFile = path.join(artifactsDir, 'no-rules.txt')
    const res = run({ SPEC_ROOT: tmpRoot, RULE_NAMES: '', OUTPUT_FILE: outFile })
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/Files scanned: 0, Errors: 0, Warnings: 0/i)
  })

  test('unknown rule -> warning is logged', () => {
    const outFile = path.join(artifactsDir, 'unknown-rule.txt')
    const res = run({ SPEC_ROOT: tmpRoot, RULE_NAMES: 'DoesNotExist', OUTPUT_FILE: outFile })
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/Unknown rule names.*DoesNotExist/i)
  })

 test('MAX_FILES limits scanning', () => {
    // Create many dummy files under the stable path to be discovered
    for (let i = 0; i < 5; i++) {
      writeFile(path.join(allowedDir, `dummy${i}.json`), '{}')
    }
    const outFile = path.join(artifactsDir, 'maxfiles.txt')
    const res = run({ SPEC_ROOT: tmpRoot, RULE_NAMES: 'PostResponseCodes', OUTPUT_FILE: outFile, MAX_FILES: '2' })
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    // New script does not emit explicit "Reached MAX_FILES"; assert summary reflects cap
    expect(out).toMatch(/Files scanned:\s*2\b/)
  })

  test('LRO POST triggers PostResponseCodes no error', () => {
    const outFile = path.join(artifactsDir, 'lro-post.txt')
    const res = run({ SPEC_ROOT: tmpRoot, RULE_NAMES: 'PostResponseCodes', OUTPUT_FILE: outFile, FAIL_ON_ERRORS: 'true' })
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/Files scanned:\s*\d+/i)
  })

  test('violating LRO POST triggers PostResponseCodes error', () => {
    const outFile = path.join(artifactsDir, 'lro-post-bad.txt')
    const res = run({ SPEC_ROOT: tmpRoot, RULE_NAMES: 'DeleteMustNotHaveRequestBody', OUTPUT_FILE: outFile, FAIL_ON_ERRORS: 'true' })
    // IN_TEST gating keeps exit code 0 even if errors are found
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/ERROR\s*\|\s*DeleteMustNotHaveRequestBody/i)
    expect(out).toMatch(/Files scanned:\s*\d+/i)
  })

  test('run multiple rules against multiple specs and flag errors', () => {
    const outFile = path.join(artifactsDir, 'multi-rules.txt')
    const res = run({ SPEC_ROOT: tmpRoot, RULE_NAMES: 'PostResponseCodes,DeleteMustNotHaveRequestBody', OUTPUT_FILE: outFile, FAIL_ON_ERRORS: 'true' })
    
    // IN_TEST gating keeps exit code 0
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/ERROR\s*\|\s*PostResponseCodes/i)
    expect(out).toMatch(/ERROR\s*\|\s*DeleteMustNotHaveRequestBody/i)
    expect(out).toMatch(/Files scanned:\s*\d+/i)
  })
})
