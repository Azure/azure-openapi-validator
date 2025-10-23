import * as fs from "fs"
import * as path from "path"
// import { runValidation } from "../src/extract-rule-names-and-run-validation.js"

import { afterAll, beforeAll, describe, expect, test } from "vitest"

const repoRoot = path.resolve(__dirname, '../../..')

async function run(env = {}) {
  // Use '.' as SPEC_CHECKOUT_PATH so runValidation uses GITHUB_WORKSPACE directly
  const testEnv = {
    GITHUB_WORKSPACE: env.GITHUB_WORKSPACE || env.SPEC_ROOT || repoRoot,
    SPEC_CHECKOUT_PATH: '.',
    MAX_FILES: env.MAX_FILES || '100',
    ALLOWED_RPS: 'network,compute,monitor,sql,hdinsight,resource,storage',
    FAIL_ON_ERRORS: env.FAIL_ON_ERRORS || 'false'
  }
  
  const selectedRules = env.RULE_NAMES ? env.RULE_NAMES.split(',').map(r => r.trim()).filter(Boolean) : []
  
  const mockCore = {
    setFailed: (msg) => console.error(`MOCK CORE setFailed: ${msg}`),
    warning: (msg) => console.log(`MOCK CORE warning: ${msg}`),
    notice: (msg) => console.log(`MOCK CORE notice: ${msg}`)
  }
  
  try {
    const { runValidation } = await import('../src/extract-rule-names-and-run-validation.js')
    const result = await runValidation(selectedRules, testEnv, mockCore)
    return { status: 0, result }
  } catch (error) {
    console.error('Test run failed:', error)
    return { status: 1, error }
  }
}

function writeFile(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, content, 'utf8')
}

describe('runner', () => {
  const tmpRoot = path.join(repoRoot, '.github', 'scripts', 'tmp-autorest-tests')
  const artifactsDir = path.join(tmpRoot, 'artifacts')
  const specsRoot = tmpRoot
  const allowedDir = path.join(specsRoot, 'specification', 'network', 'resource-manager', 'stable')

  beforeAll(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true })
    fs.mkdirSync(artifactsDir, { recursive: true })
    fs.mkdirSync(allowedDir, { recursive: true })

    const sourceSpecs = path.join(__dirname, 'fixtures')
    try {
        fs.copyFileSync(path.join(sourceSpecs, 'bad-lro-post.json'), path.join(allowedDir, 'lro-bad.json'))
    } catch (err) {
        console.error('Failed to copy spec files:', err)
    }
  })

  afterAll(() => {
    //fs.rmSync(tmpRoot, { recursive: true, force: true })
  })


  test('unknown rule -> processes without errors', async () => {
    const outFile = path.join(tmpRoot, 'artifacts', 'linter-findings.txt')
    const res = await run({ RULE_NAMES: 'DoesNotExist', GITHUB_WORKSPACE: tmpRoot })
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/Files scanned:/i)
  })

 test('MAX_FILES limits scanning', async () => {
    for (let i = 0; i < 5; i++) {
      writeFile(path.join(allowedDir, `dummy${i}.json`), '{}')
    }
    const outFile = path.join(tmpRoot, 'artifacts', 'linter-findings.txt')
    const res = await run({ RULE_NAMES: 'PostResponseCodes', GITHUB_WORKSPACE: tmpRoot, MAX_FILES: '2' })
    expect(res.status).toBe(0)
    const out = fs.readFileSync(outFile, 'utf8')
    expect(out).toMatch(/Files scanned:\s*2\b/)
  })
})
