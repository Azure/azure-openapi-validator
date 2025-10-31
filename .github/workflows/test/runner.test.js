import * as fs from "fs";
import * as path from "path";
import { afterAll, beforeAll, expect, test } from "vitest";
import { runValidation } from "../src/extract-rule-names-and-run-validation.js";

const repoRoot = path.resolve(__dirname, "../../..");
const tmpRoot = path.join(repoRoot, ".github", "scripts", "tmp-autorest-tests");
const artifactsDir = path.join(tmpRoot, "artifacts");
const specsRoot = tmpRoot;
const allowedDir = path.join(specsRoot, "specification", "network", "resource-manager", "stable");

const mockCore = {
  setFailed: (msg) => console.error(`MOCK CORE setFailed: ${msg}`),
  warning: (msg) => console.log(`MOCK CORE warning: ${msg}`),
  notice: (msg) => console.log(`MOCK CORE notice: ${msg}`),
};

function writeFile(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, "utf8");
}

beforeAll(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
  fs.mkdirSync(artifactsDir, { recursive: true });
  fs.mkdirSync(allowedDir, { recursive: true });

  const sourceSpecs = path.join(__dirname, "fixtures");
  try {
    fs.copyFileSync(
      path.join(sourceSpecs, "bad-lro-post.json"),
      path.join(allowedDir, "lro-bad.json"),
    );
  } catch (err) {
    console.error("Failed to copy spec files:", err);
  }
});

afterAll(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
});

test("unknown rule -> processes without errors", async () => {
  const testEnv = {
    GITHUB_WORKSPACE: tmpRoot,
    SPEC_CHECKOUT_PATH: ".",
    MAX_FILES: "100",
    ALLOWED_RPS: "network,compute,monitor,sql,hdinsight,resource,storage",
    FAIL_ON_ERRORS: "false",
  };

  const outFile = path.join(tmpRoot, "artifacts", "linter-findings.txt");
  const res = await runValidation(["DoesNotExist"], testEnv, mockCore);
  expect(res).toBeDefined();
  const out = fs.readFileSync(outFile, "utf8");
  expect(out).toMatch(/Files scanned:/i);
});

test("MAX_FILES limits scanning", async () => {
  for (let i = 0; i < 5; i++) {
    writeFile(path.join(allowedDir, `dummy${i}.json`), "{}");
  }

  const testEnv = {
    GITHUB_WORKSPACE: tmpRoot,
    SPEC_CHECKOUT_PATH: ".",
    MAX_FILES: "2",
    ALLOWED_RPS: "network,compute,monitor,sql,hdinsight,resource,storage",
    FAIL_ON_ERRORS: "false",
  };

  const outFile = path.join(tmpRoot, "artifacts", "linter-findings.txt");
  const res = await runValidation(["PostResponseCodes"], testEnv, mockCore);
  expect(res).toBeDefined();
  const out = fs.readFileSync(outFile, "utf8");
  expect(out).toMatch(/Files scanned:\s*2\b/);
});
