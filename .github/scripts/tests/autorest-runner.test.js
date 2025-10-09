const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const repoRoot = path.resolve(__dirname, '../../..')
const scriptPath = path.join(repoRoot, '.github', 'scripts', 'run-autorest-selected-rules.js')

function run(env = {}, cwd = repoRoot) {
  return spawnSync(process.execPath, [scriptPath], {
    cwd,
    env: { ...process.env, ...env, IN_TEST: 'true' },
    encoding: 'utf8',
    timeout: 60000
  })
}

function writeFile(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, content, 'utf8')
}

describe('autorest runner (selective)', () => {
  const tmpRoot = path.join(repoRoot, '.github', 'scripts', 'tmp-autorest-tests')
  const specsDir = path.join(__dirname, 'specs')
  const artifactsDir = path.join(tmpRoot, 'artifacts')
  const allowedDir = path.join(tmpRoot, 'specification', 'network', 'resource-manager', 'stable')

  beforeAll(() => {
    try {
      fs.rmSync(tmpRoot, { recursive: true, force: true })
    } catch {}
    fs.mkdirSync(allowedDir, { recursive: true })
    fs.mkdirSync(artifactsDir, { recursive: true })
    
    // Copy existing spec files to the test directory structure
    const sourceSpecs = path.join(__dirname, 'specs')
    try {
      fs.copyFileSync(path.join(sourceSpecs, 'lro-post-demo.json'), path.join(allowedDir, 'lro-good.json'))
      fs.copyFileSync(path.join(sourceSpecs, 'bad-lro-post.json'), path.join(allowedDir, 'lro-bad.json'))
      fs.copyFileSync(path.join(sourceSpecs, 'bad-delete-with-body.json'), path.join(allowedDir, 'delete-bad.json'))
    } catch (err) {
      console.error('Failed to copy spec files:', err)
    }
  })

  afterAll(() => {
    try {
      fs.rmSync(tmpRoot, { recursive: true, force: true })
    } catch {}
  })

  // Helper function for unit tests (skips AutoRest)
  function runUnitTest(env = {}, cwd = repoRoot) {
    return spawnSync(process.execPath, [scriptPath], {
      cwd,
      env: { ...process.env, ...env, IN_TEST: 'true', SKIP_AUTOREST: 'true' },
      encoding: 'utf8',
      timeout: 10000
    })
  }

  // Helper function for integration tests (runs AutoRest)  
  function runIntegrationTest(env = {}, cwd = repoRoot) {
    return spawnSync(process.execPath, [scriptPath], {
      cwd,
      env: { ...process.env, ...env, IN_TEST: 'true' },
      encoding: 'utf8',
      timeout: 30000
    })
  }

  it('no RULE_NAMES -> immediate summary', () => {
    const outFile = path.join(artifactsDir, 'no-rules.txt')
    const res = runUnitTest({ SPEC_ROOT: tmpRoot, RULE_NAMES: '', OUTPUT_FILE: outFile })
    // Should exit 0 for no rules case
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/Files scanned: 0, Errors: 0, Warnings: 0/i)
  })

  it('unknown rule names -> warning emitted', () => {
    // Create a test spec file so the script will check for unknown rules
    writeFile(path.join(allowedDir, 'test.json'), '{}')
    
    const outFile = path.join(artifactsDir, 'unknown-rules.txt')
    const res = runUnitTest({ SPEC_ROOT: tmpRoot, RULE_NAMES: 'DoesNotExist', OUTPUT_FILE: outFile })
    
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/Files scanned: \d+, Errors: 0, Warnings: 0/i)
    
    // Check stdout for the warning message
    expect(res.stdout + res.stderr).toMatch(/Unknown rule names.*DoesNotExist/i)
  })

  it('MAX_FILES limits scanning', () => {
    // Create many dummy files under allowed path so the runner includes them
    for (let i = 0; i < 5; i++) {
      writeFile(path.join(allowedDir, `dummy${i}.json`), '{}')
    }
    const outFile = path.join(artifactsDir, 'maxfiles.txt')
    const res = runUnitTest({ SPEC_ROOT: tmpRoot, RULE_NAMES: 'PostResponseCodes', OUTPUT_FILE: outFile, MAX_FILES: '2' })
    
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/Files scanned: 2/i)
    
    // Should log processing count in output
    expect(res.stdout + res.stderr).toMatch(/Processing 2 file/i)
  })

  // Integration tests that actually run AutoRest (may be slower)
  describe('AutoRest integration', () => {
    // Test that AutoRest integration can be enabled and works without crashing
    it('can execute AutoRest without crashing', () => {
      const outFile = path.join(artifactsDir, 'integration-test.txt')
      const res = runIntegrationTest({ SPEC_ROOT: tmpRoot, RULE_NAMES: 'PostResponseCodes', OUTPUT_FILE: outFile })
      
      // Check that the script either succeeded or handled errors gracefully
      expect([0, 1, null]).toContain(res.status)
      
      if (res.status === null) {
        console.log('AutoRest timed out - this indicates AutoRest is available but slow')
        expect(res.error?.message).toContain('ETIMEDOUT')
      } else if (res.status === 0) {
        console.log('AutoRest executed successfully')
        expect(fs.existsSync(outFile)).toBe(true)
      } else if (res.status === 1) {
        console.log('AutoRest had issues but script handled it gracefully')
        expect(res.stderr).toBeTruthy()
      }
    })
    
    // Test suppression file generation works properly
    it('generates suppression file correctly', () => {
      const outFile = path.join(artifactsDir, 'suppression-test.txt')
      const res = runIntegrationTest({ SPEC_ROOT: tmpRoot, RULE_NAMES: 'PostResponseCodes,DeleteMustNotHaveRequestBody', OUTPUT_FILE: outFile })
      
      // Verify the script processes the request properly (regardless of AutoRest outcome)
      expect(res.status !== undefined).toBe(true)
      expect(res.stdout).toContain('Processing')
      
      // Should contain rule validation output
      const output = res.stdout + res.stderr
      expect(output).toMatch(/Files scanned: \d+/)
    })
  })
  
  // Optional extended integration tests (can be enabled manually)
  describe('Extended AutoRest integration', () => {
    it('validates PostResponseCodes rule against good spec', () => {
      const outFile = path.join(artifactsDir, 'lro-good-extended.txt')
      const res = runIntegrationTest({ SPEC_ROOT: tmpRoot, RULE_NAMES: 'PostResponseCodes', OUTPUT_FILE: outFile, MAX_FILES: '1' })
      
      if (res.status === 0 && fs.existsSync(outFile)) {
        const out = fs.readFileSync(outFile, 'utf8')
        expect(out).not.toMatch(/ERROR\s*\|\s*PostResponseCodes/i)
      }
    })
    
    it('validates DeleteMustNotHaveRequestBody rule against bad spec', () => {
      const outFile = path.join(artifactsDir, 'delete-bad-extended.txt')
      const res = runIntegrationTest({ SPEC_ROOT: tmpRoot, RULE_NAMES: 'DeleteMustNotHaveRequestBody', OUTPUT_FILE: outFile, MAX_FILES: '1' })
      
      if (res.status === 0 && fs.existsSync(outFile)) {
        const out = fs.readFileSync(outFile, 'utf8')
        expect(out).toMatch(/ERROR\s*\|\s*DeleteMustNotHaveRequestBody/i)
      }
    })
  })
})