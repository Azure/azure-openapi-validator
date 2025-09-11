const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const repoRoot = path.resolve(__dirname, '../../..')
const scriptPath = path.join(repoRoot, '.github', 'scripts', 'run-selected-rules.js')

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
  const allowedDir = path.join(specsDir, 'specification', 'network', 'resource-manager', 'stable')
  const srcDir = path.join(__dirname, 'specs')

  beforeAll(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true })
    fs.mkdirSync(specsDir, { recursive: true })
    fs.mkdirSync(artifactsDir, { recursive: true })
    fs.mkdirSync(allowedDir, { recursive: true })
  })

  afterAll(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true })
  })

  test('no rules -> no-op with summary and 0 exit', () => {
    const outFile = path.join(artifactsDir, 'no-rules.txt')
    const res = run({ SPEC_ROOT: specsDir, RULE_NAMES: '', OUTPUT_FILE: outFile })
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/No rules specified; nothing to run/i)
    expect(out).toMatch(/Files scanned: 0/i)
  })

  test('unknown rule -> warning is logged', () => {
    const outFile = path.join(artifactsDir, 'unknown-rule.txt')
    const res = run({ SPEC_ROOT: specsDir, RULE_NAMES: 'DoesNotExist', OUTPUT_FILE: outFile })
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/Unknown rule names: DoesNotExist/)
  })

  test('MAX_FILES limits scanning', () => {
    // Create many dummy files under allowed path so the runner includes them
    for (let i = 0; i < 5; i++) {
      writeFile(path.join(allowedDir, `dummy${i}.json`), '{}')
    }
    const outFile = path.join(artifactsDir, 'maxfiles.txt')
    const res = run({ SPEC_ROOT: specsDir, RULE_NAMES: 'PostResponseCodes', OUTPUT_FILE: outFile, MAX_FILES: '2' })
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/Reached MAX_FILES=2/)
  })

  test('LRO POST triggers PostResponseCodes no error', () => {
    // Copy fixture into allowed path
    const fixture = path.join(srcDir, 'lro-post-demo.json')
    const target = path.join(allowedDir, 'lro-post-demo.json')
    writeFile(target, fs.readFileSync(fixture, 'utf8'))
    const outFile = path.join(artifactsDir, 'lro-post.txt')
    const res = run({ SPEC_ROOT: target, RULE_NAMES: 'PostResponseCodes', OUTPUT_FILE: outFile, FAIL_ON_ERRORS: 'true' })
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/Files scanned:\s*\d+/i)
  })

  test('violating LRO POST triggers PostResponseCodes error', () => {
    // Copy violating spec into allowed path and run against that file
    const fixture = path.join(srcDir, 'bad-lro-post.json')
    const badSpec = path.join(allowedDir, 'bad-lro-post.json')
    writeFile(badSpec, fs.readFileSync(fixture, 'utf8'))
    const outFile = path.join(artifactsDir, 'lro-post-bad.txt')
    const res = run({ SPEC_ROOT: badSpec, RULE_NAMES: 'PostResponseCodes', OUTPUT_FILE: outFile, FAIL_ON_ERRORS: 'true' })
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/ERROR\s*\|\s*PostResponseCodes/i)
    expect(out).toMatch(/Files scanned:\s*\d+/i)
  })

  test('run multiple rules against multiple specs and flag errors', () => {
    const outFile = path.join(artifactsDir, 'multi-rules.txt')
    // Copy fixtures into allowed path
    const badLro = path.join(srcDir, 'bad-lro-post.json')
    const badDelete = path.join(srcDir, 'bad-delete-with-body.json')
    writeFile(path.join(allowedDir, 'bad-lro-post.json'), fs.readFileSync(badLro, 'utf8'))
    writeFile(path.join(allowedDir, 'bad-delete-with-body.json'), fs.readFileSync(badDelete, 'utf8'))
    const res = run({
      SPEC_ROOT: allowedDir,
      RULE_NAMES: 'PostResponseCodes,DeleteMustNotHaveRequestBody',
      OUTPUT_FILE: outFile,
      FAIL_ON_ERRORS: 'true'
    })
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/ERROR\s*\|\s*PostResponseCodes/i)
    expect(out).toMatch(/ERROR\s*\|\s*DeleteMustNotHaveRequestBody/i)
    expect(out).toMatch(/Files scanned:\s*\d+/i)
  })
})
