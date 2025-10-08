const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const repoRoot = path.resolve(__dirname, '../../..')
const scriptPath = path.join(repoRoot, '.github', 'scripts', 'run-autorest-selected-rules.js')

function run(env = {}, cwd = repoRoot) {
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd,
    env: { ...process.env, ...env },
    encoding: 'utf8',
    timeout: 60000,
  })
  return result
}

function writeFile(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, content, 'utf8')
}

describe('runner', () => {
  const tmpRoot = path.join(repoRoot, '.github', 'scripts', 'tmp-tests')
  const specsDir = path.join(tmpRoot, 'specs')
  const artifactsDir = path.join(tmpRoot, 'artifacts')

  beforeAll(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true })
    fs.mkdirSync(specsDir, { recursive: true })
    fs.mkdirSync(artifactsDir, { recursive: true })
  })

  afterAll(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true })
  })

  test('no rules -> no-op with summary and 0 exit', () => {
    const outFile = path.join(artifactsDir, 'no-rules.txt')
    // New script logs: 'INFO | Runner | rules | No RULE_NAMES specified; nothing to run.'
    const res = run({ SPEC_ROOT: specsDir, RULE_NAMES: '', OUTPUT_FILE: outFile })
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/No\s+RULE_NAMES\s+specified;\s+nothing\s+to\s+run/i)
    expect(out).toMatch(/Files scanned:\s*0/i)
  })

  test('unknown rule -> warning is logged', () => {
    const outFile = path.join(artifactsDir, 'unknown-rule.txt')
    const res = run({ SPEC_ROOT: specsDir, RULE_NAMES: 'DoesNotExist', OUTPUT_FILE: outFile })
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/Unknown rule names: DoesNotExist/)
  })

 test('MAX_FILES limits scanning', () => {
    // Create many dummy files
    for (let i = 0; i < 5; i++) {
      writeFile(path.join(specsDir, `dummy${i}.json`), '{}')
    }
    const outFile = path.join(artifactsDir, 'maxfiles.txt')
    const res = run({ SPEC_ROOT: specsDir, RULE_NAMES: 'PostResponseCodes', OUTPUT_FILE: outFile, MAX_FILES: '2' })
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/Reached MAX_FILES=2/)
  })

  test('LRO POST triggers PostResponseCodes no error', () => {
    const localSpecRoot = path.join(__dirname, 'specs', 'lro-post-demo.json')
    const outFile = path.join(artifactsDir, 'lro-post.txt')
    const res = run({ SPEC_ROOT: localSpecRoot, RULE_NAMES: 'PostResponseCodes', OUTPUT_FILE: outFile, FAIL_ON_ERRORS: 'true' })
    // IN_TEST gating keeps exit code 0 even if errors are found
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/Files scanned:\s*\d+/i)
  })

  test('violating LRO POST triggers PostResponseCodes error', () => {
    // Run directly against only the violating spec file
    const badSpec = path.join(__dirname, 'specs', 'bad-lro-post.json')
    const outFile = path.join(artifactsDir, 'lro-post-bad.txt')
    const res = run({ SPEC_ROOT: badSpec, RULE_NAMES: 'PostResponseCodes', OUTPUT_FILE: outFile, FAIL_ON_ERRORS: 'true' })
    // IN_TEST gating keeps exit code 0 even if errors are found
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/ERROR\s*\|\s*PostResponseCodes/i)
    expect(out).toMatch(/Files scanned:\s*\d+/i)
  })

  test('run multiple rules against multiple specs and flag errors', () => {
    const outFile = path.join(artifactsDir, 'multi-rules.txt')
    const specRoot = path.join(__dirname, 'specs')
    // Ensure both violating specs exist
    expect(fs.existsSync(path.join(specRoot, 'bad-lro-post.json'))).toBe(true)
    expect(fs.existsSync(path.join(specRoot, 'bad-delete-with-body.json'))).toBe(true)
    const res = run({
      SPEC_ROOT: specRoot,
      RULE_NAMES: 'PostResponseCodes,DeleteMustNotHaveRequestBody',
      OUTPUT_FILE: outFile,
      FAIL_ON_ERRORS: 'true'
    })
    // IN_TEST gating keeps exit code 0
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/ERROR\s*\|\s*PostResponseCodes/i)
    expect(out).toMatch(/ERROR\s*\|\s*DeleteMustNotHaveRequestBody/i)
    expect(out).toMatch(/Files scanned:\s*\d+/i)
  })
})