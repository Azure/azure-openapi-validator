const { isArmSpec, collectSpecs, parseMessages } = require('../scripts/run-autorest-selected-rules');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

describe('run-autorest-selected-rules', () => {
  // ====================
  // UNIT TESTS
  // ====================
  
  describe('isArmSpec (unit)', () => {
    test('accepts valid ARM stable spec', () => {
      expect(isArmSpec('specification/network/resource-manager/stable/2021-01-01/network.json')).toBe(true);
    });

    test('accepts valid ARM stable spec with Windows paths', () => {
      expect(isArmSpec('specification\\compute\\resource-manager\\stable\\2022-01-01\\compute.json')).toBe(true);
    });

    test('rejects non-JSON files', () => {
      expect(isArmSpec('specification/network/resource-manager/stable/2021-01-01/readme.md')).toBe(false);
    });

    test('rejects preview specs', () => {
      expect(isArmSpec('specification/network/resource-manager/preview/2021-01-01-preview/network.json')).toBe(false);
    });

    test('rejects data-plane specs', () => {
      expect(isArmSpec('specification/network/data-plane/stable/2021-01-01/network.json')).toBe(false);
    });

    test('rejects specs without resource-manager', () => {
      expect(isArmSpec('specification/network/stable/2021-01-01/network.json')).toBe(false);
    });
  });

  describe('collectSpecs (unit)', () => {
    const testRoot = path.join(__dirname, 'temp-test-specs');

    beforeAll(() => {
      // Create test directory structure
      fs.mkdirSync(testRoot, { recursive: true });
      
      const paths = [
        'specification/network/resource-manager/stable/2021-01-01/network.json',
        'specification/network/resource-manager/stable/2021-01-01/vnet.json',
        'specification/network/resource-manager/preview/2021-01-01/preview.json',
        'specification/compute/resource-manager/stable/2022-01-01/compute.json',
        'specification/storage/resource-manager/stable/2023-01-01/storage.json',
      ];

      for (const p of paths) {
        const fullPath = path.join(testRoot, p);
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, '{}');
      }
    });

    afterAll(() => {
      fs.rmSync(testRoot, { recursive: true, force: true });
    });

    test('collects ARM specs from specified RPs', () => {
      const specs = collectSpecs(testRoot, ['network', 'compute'], 100);
      
      expect(specs).toHaveLength(3);
      expect(specs.some(s => s.includes('network.json'))).toBe(true);
      expect(specs.some(s => s.includes('vnet.json'))).toBe(true);
      expect(specs.some(s => s.includes('compute.json'))).toBe(true);
    });

    test('respects maxFiles limit', () => {
      const specs = collectSpecs(testRoot, ['network', 'compute', 'storage'], 2);
      
      expect(specs).toHaveLength(2);
    });

    test('handles non-existent RP gracefully', () => {
      const specs = collectSpecs(testRoot, ['nonexistent'], 100);
      
      expect(specs).toHaveLength(0);
    });
  });

  describe('parseMessages (unit)', () => {
    test('parses valid JSON messages from stdout', () => {
      const stdout = `
        Some text
        {"extensionName":"@microsoft.azure/openapi-validator","level":"error","code":"PostResponseCodes","message":"Missing 200 response"}
        More text
      `;
      
      const messages = parseMessages(stdout, '');
      
      expect(messages).toHaveLength(1);
      expect(messages[0].code).toBe('PostResponseCodes');
      expect(messages[0].message).toBe('Missing 200 response');
    });

    test('parses multiple messages', () => {
      const stdout = `
        {"extensionName":"@microsoft.azure/openapi-validator","level":"error","code":"RuleOne","message":"Error 1"}
        {"extensionName":"@microsoft.azure/openapi-validator","level":"warning","code":"RuleTwo","message":"Warning 1"}
      `;
      
      const messages = parseMessages(stdout, '');
      
      expect(messages).toHaveLength(2);
      expect(messages[0].code).toBe('RuleOne');
      expect(messages[1].code).toBe('RuleTwo');
    });

    test('ignores messages from other extensions', () => {
      const stdout = `
        {"extensionName":"other-extension","code":"SomeRule"}
        {"extensionName":"@microsoft.azure/openapi-validator","code":"OurRule"}
      `;
      
      const messages = parseMessages(stdout, '');
      
      expect(messages).toHaveLength(1);
      expect(messages[0].code).toBe('OurRule');
    });

    test('handles empty input', () => {
      const messages = parseMessages('', '');
      
      expect(messages).toHaveLength(0);
    });
  });

  // ====================
  // END-TO-END TESTS
  // ====================

  describe('end-to-end', () => {
    const repoRoot = path.resolve(__dirname, '../..');
    const scriptPath = path.join(__dirname, '../scripts/run-autorest-selected-rules.js');
    const tmpRoot = path.join(__dirname, 'temp-e2e-tests');
    const artifactsDir = path.join(tmpRoot, 'artifacts');
    const specsDir = path.join(__dirname, 'specs');
    const allowedDir = path.join(tmpRoot, 'specification', 'network', 'resource-manager', 'stable');

    function runScript(env = {}) {
      return spawnSync(process.execPath, [scriptPath], {
        cwd: repoRoot,
        env: { ...process.env, ...env, IN_TEST: 'true' },
        encoding: 'utf8',
        timeout: 90000,
      });
    }

    beforeAll(() => {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
      fs.mkdirSync(artifactsDir, { recursive: true });
      fs.mkdirSync(allowedDir, { recursive: true });

      // Copy test spec files
      try {
        fs.copyFileSync(
          path.join(specsDir, 'bad-lro-post.json'),
          path.join(allowedDir, 'lro-bad.json')
        );
      } catch (err) {
        console.error('Failed to copy spec files:', err);
      }
    });

    afterAll(() => {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    });

    test('no rules -> exits with summary', () => {
      const outFile = path.join(artifactsDir, 'no-rules.txt');
      const res = runScript({
        SPEC_ROOT: tmpRoot,
        RULE_NAMES: '',
        OUTPUT_FILE: outFile,
      });

      expect(res.status).toBe(0);
      const out = fs.readFileSync(outFile, 'utf8');
      expect(out).toMatch(/Files scanned: 0, Errors: 0, Warnings: 0/i);
    });

    test('unknown rule -> logs warning', () => {
      const outFile = path.join(artifactsDir, 'unknown-rule.txt');
      const res = runScript({
        SPEC_ROOT: tmpRoot,
        RULE_NAMES: 'DoesNotExist',
        OUTPUT_FILE: outFile,
      });

      expect(res.status).toBe(0);
      const out = fs.readFileSync(outFile, 'utf8');
      expect(out).toMatch(/Files scanned:\s*\d+/i);
    });

    test('valid rule -> validates spec', () => {
      const outFile = path.join(artifactsDir, 'valid-rule.txt');
      const res = runScript({
        SPEC_ROOT: tmpRoot,
        RULE_NAMES: 'DeleteMustNotHaveRequestBody',
        OUTPUT_FILE: outFile,
        FAIL_ON_ERRORS: 'true',
      });

      expect(res.status).toBe(0);
      const out = fs.readFileSync(outFile, 'utf8');
      expect(out).toMatch(/ERROR\s*\|\s*DeleteMustNotHaveRequestBody/i);
      expect(out).toMatch(/Files scanned:\s*\d+/i);
    });
  });
});
