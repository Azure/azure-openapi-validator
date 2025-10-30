// @ts-check

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

import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import { basename, dirname, join, relative } from "path";
import { execNpmExec } from "../../shared/src/exec.js";

/**
 * Extract rule names from PR labels
 * Expects labels in format: test-<RuleName>
 * @param {Array<string | {name: string}>} labels - Array of label names or label objects
 * @returns {string[]} - Array of extracted rule names
 */
export function extractRulesFromLabels(labels) {
  // If labels are objects (GitHub API), map to their name first.
  const names = labels.map((l) => (l && typeof l === "object" ? l.name : l));
  return names
    .filter((name) => /^test-/i.test(name))
    .map((name) => name.replace(/^test-/i, "").trim())
    .filter(Boolean);
}

/**
 * Extract rule names from PR body
 * Parses lines matching pattern: rules: RuleName1, RuleName2
 * @param {string} body - PR body text
 * @returns {string[]} - Array of extracted rule names
 */
export function extractRulesFromBody(body) {
  // Find lines like "rules: A, B" or "rule: A"
  const matches = body.match(/^\s*rules?\s*:(.*)$/gim) ?? [];
  const ruleLine = matches.map((line) => line.split(":")[1] ?? "").join(",");
  return ruleLine
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Extract and combine rule names from GitHub context
 * Combines rules from both labels and body, removing duplicates
 * @param {import('@actions/github-script').AsyncFunctionArguments['context']} context  - GitHub Actions context object
 * @returns {string[]} - Array of unique rule names
 */
export function extractRuleNames(context) {
  const pr = context.payload.pull_request;
  if (!pr) return [];

  const fromLabels = extractRulesFromLabels(pr.labels ?? []);
  const fromBody = extractRulesFromBody(pr.body ?? "");

  // Combine both sources and remove duplicates
  const allRules = [...fromLabels, ...fromBody];
  return Array.from(new Set(allRules));
}

/**
 * Enumerate stable ARM swagger files.
 * Criteria: contains /resource-manager/ and /stable/, ends with .json.
 * Excludes examples, readme, quickstart-templates, scenarios.
 * Distributes files randomly across all allowed RPs to ensure diversity.
 * @param {string} specRoot - Root directory containing specifications
 * @param {string[]} allowedRPs - Array of allowed resource provider names
 * @param {number} maxFiles - Maximum number of files to return
 * @returns {string[]} - Array of file paths
 */
function enumerateSpecs(specRoot, allowedRPs, maxFiles) {
  /** @param {string} p */
  const isStableArm = (p) => /\/resource-manager\//.test(p) && /\/stable\//.test(p);
  const allFiles = [];

  // Collect all matching files from all RPs
  for (const rp of allowedRPs) {
    const rpRoot = join(specRoot, "specification", rp);
    if (!existsSync(rpRoot)) continue;

    const stack = [rpRoot];
    while (stack.length > 0) {
      const current = stack.pop();
      if (!current) continue;

      let entries;
      try {
        entries = readdirSync(current, { withFileTypes: true });
      } catch {
        continue;
      }

      for (const entry of entries) {
        const abs = join(current, entry.name);
        if (entry.isDirectory()) {
          stack.push(abs);
          continue;
        }
        if (!entry.isFile()) continue;
        if (!abs.toLowerCase().endsWith(".json")) continue;

        const norm = abs.replace(/\\/g, "/");
        if (!isStableArm(norm)) continue;
        if (/\/examples\//i.test(norm)) continue;
        if (/readme\.(md|json)$/i.test(norm)) continue;
        if (/quickstart-templates\//i.test(norm)) continue;
        if (/\/scenarios\//i.test(norm)) continue;

        allFiles.push(abs);
      }
    }
  }

  // Shuffle using sort with random comparator and take first maxFiles
  const results = allFiles.sort(() => Math.random() - 0.5).slice(0, maxFiles);

  // Log distribution for transparency
  console.log(`Collected ${results.length} files randomly from ${allFiles.length} total files`);
  const rpCounts = new Map();
  for (const file of results) {
    const match = file.match(/specification[/\\]([^/\\]+)[/\\]/);
    if (match) {
      const rp = match[1];
      rpCounts.set(rp, (rpCounts.get(rp) || 0) + 1);
    }
  }
  rpCounts.forEach((count, rp) => {
    console.log(`  ${rp}: ${count} files`);
  });

  return results;
}

/**
 * Run AutoRest against a single specification file
 * @param {string} specPath - Path to the specification file
 * @param {string} specRoot - Root directory of specifications
 * @param {string[]} selectedRules - Array of rule names to validate
 * @param {string} repoRoot - Root directory of the repository
 * @returns {Promise<import("../../shared/src/exec.js").ExecResult>}
 */
async function runAutorest(specPath, specRoot, selectedRules, repoRoot) {
  const start = Date.now();
  const rel = relative(specRoot, specPath).replace(/\\/g, "/");
  const args = [
    "autorest",
    "--level=warning",
    "--v3",
    "--spectral",
    "--azure-validator",
    "--semantic-validator=false",
    "--model-validator=false",
    "--openapi-type=arm",
    "--openapi-subtype=arm",
    "--message-format=json",
    // Pass selected rules down to the validator so only those rules execute inside the plugins.
    `--selected-rules=${selectedRules.join(",")}`,
    `--use=${join(repoRoot, "packages", "azure-openapi-validator", "autorest")}`,
    `--input-file=${specPath}`,
  ];

  const result = await execNpmExec(args);

  const dur = Date.now() - start;
  console.log(`DEBUG | runAutorest | end | ${rel} (${dur}ms)`);

  return result;
}

/**
 * Parse AutoRest output for validation messages
 * @param {string} stdout - Standard output from AutoRest
 * @param {string} stderr - Standard error output from AutoRest
 * @returns {any[]} - Array of parsed validation messages
 */
function parseMessages(stdout, stderr) {
  /** @type {any[]} */
  const msgs = [];
  const allOutput = stdout + "\n" + stderr;
  console.log(`DEBUG | parseMessages | Total output length: ${allOutput.length} characters`);

  allOutput.split(/\r?\n/).forEach((line, idx) => {
    if (!line.includes('"extensionName":"@microsoft.azure/openapi-validator"')) return;

    const i = line.indexOf("{");
    if (i < 0) {
      console.log(`DEBUG | parseMessages | Line ${idx} has no opening brace`);
      return;
    }

    try {
      const parsed = JSON.parse(line.slice(i));
      msgs.push(parsed);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.log(`DEBUG | parseMessages | Line ${idx} failed to parse: ${errorMessage}`);
    }
  });

  return msgs;
}

/**
 * Main execution function for GitHub Actions
 * @param {import('@actions/github-script').AsyncFunctionArguments} AsyncFunctionArguments
 */
export async function runInGitHubActions({ context, core }) {
  try {
    // Extract rule names from PR
    const selectedRules = extractRuleNames(context);

    core.notice(
      `Selected Rules: ${selectedRules.length > 0 ? selectedRules.join(", ") : "<none>"}`,
    );

    if (selectedRules.length === 0) {
      core.warning("No linting rules specified in labels or PR body");
      // Create empty output file
      const outputFile = join(
        process.env.GITHUB_WORKSPACE || "",
        "artifacts",
        "linter-findings.txt",
      );
      mkdirSync(dirname(outputFile), { recursive: true });
      writeFileSync(
        outputFile,
        "INFO | Runner | summary | Files scanned: 0, Errors: 0, Warnings: 0\n",
      );
      return;
    }

    return await runValidation(selectedRules, process.env, core);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    core.setFailed(`Script execution failed: ${errorMessage}`);
    throw error;
  }
}

/**
 * Core validation logic
 * @param {string[]} selectedRules - Array of rule names to validate
 * @param {any} env - Environment variables object
 * @param {import('@actions/github-script').AsyncFunctionArguments['core'] | null} core  - GitHub Actions core object (optional)
 */
export async function runValidation(selectedRules, env, core = null) {
  const repoRoot = env.GITHUB_WORKSPACE || process.cwd();
  const specRoot = join(repoRoot, env.SPEC_CHECKOUT_PATH || "specs");
  const maxFiles = parseInt(env.MAX_FILES || "100", 10);
  const allowedRps = (env.ALLOWED_RPS || "compute,monitor,sql,hdinsight,network,resource,storage")
    .split(",")
    .map((/** @type {string} */ s) => s.trim())
    .filter(Boolean);
  const outputFile = join(repoRoot, "artifacts", "linter-findings.txt");

  console.log(`Processing rules: ${selectedRules.join(", ")}`);
  console.log(`Max files: ${maxFiles}, Allowed RPs: ${allowedRps.join(", ")}`);
  console.log(`Spec root: ${specRoot}`);

  let specs;
  try {
    specs = enumerateSpecs(specRoot, allowedRps, maxFiles);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const message = `Failed to enumerate specs: ${errorMessage}`;
    if (core) {
      core.setFailed(message);
    } else {
      console.error(`ERROR | ${message}`);
    }
    return { specs: 0, errors: 0, warnings: 0 };
  }
  if (!specs.length) {
    const message = "No matching spec files found";
    if (core) {
      core.warning(message);
    } else {
      console.log(`WARN | ${message}`);
    }

    mkdirSync(dirname(outputFile), { recursive: true });
    writeFileSync(
      outputFile,
      "INFO | Runner | summary | Files scanned: 0, Errors: 0, Warnings: 0\n",
    );
    return { specs: 0, errors: 0, warnings: 0 };
  }

  console.log(`Processing ${specs.length} file(s)`);
  let errors = 0;
  let warnings = 0;
  const outLines = [];
  const seenErrors = new Set(); // Track unique errors to avoid duplicates from $ref resolution

  // Process each spec file sequentially
  for (const spec of specs) {
    let res;
    try {
      res = await runAutorest(spec, specRoot, selectedRules, repoRoot);
    } catch (error) {
      console.log(`Failed ${spec}: ${error}`);
      continue;
    }

    const messages = parseMessages(res.stdout, res.stderr);
    const specRelPath = relative(specRoot, spec).replace(/\\/g, "/");
    const specBasename = basename(spec);
    console.log(`Found ${messages.length} message(s) for ${specRelPath}`);

    for (const m of messages) {
      const code = m.code || m.id || "Unknown";
      if (selectedRules.indexOf(code) === -1) continue;

      // Extract the actual source file from the message
      // The source field contains the actual file where the error occurred
      let errorSourceFile = null;
      let errorSourcePath = null;

      if (m.source && Array.isArray(m.source) && m.source.length > 0) {
        const sourceEntry = m.source[0];
        if (sourceEntry && sourceEntry.document) {
          // Extract file path from URI like "file:///home/runner/.../applicationGateway.json"
          errorSourcePath = sourceEntry.document;
          const match = errorSourcePath.match(/([^/\\]+)\.json$/i);
          if (match) {
            errorSourceFile = match[0]; // e.g., "applicationGateway.json"
          }
        }
      }

      // Skip errors that don't have source information or don't match the spec being processed
      if (!errorSourceFile) {
        const jsonpath = m.details?.jsonpath?.[1] || "unknown";
        console.log(`DEBUG | Skipping error with no source field - path: ${jsonpath}`);
        continue;
      }

      if (errorSourceFile !== specBasename) {
        console.log(
          `DEBUG | Skipping error from different file - error source: ${errorSourceFile}, current spec: ${specBasename}`,
        );
        continue;
      }

      console.log(`DEBUG | Processing error from matching file: ${errorSourceFile}`);

      // Extract line and column from the source position (more accurate than other fields)
      const line =
        m.source?.[0]?.position?.line ??
        m.details?.range?.start?.line ??
        m.range?.start?.line ??
        undefined;
      const column =
        m.source?.[0]?.position?.column ??
        m.details?.range?.start?.column ??
        m.range?.start?.character ??
        undefined;
      const loc = line !== undefined ? `:${line}${column !== undefined ? `:${column}` : ""}` : "";

      // Create unique signature for error deduplication
      // Even with source filtering, the same file might be validated multiple times
      const errorSignature = `${errorSourceFile}:${line}:${column}:${code}:${m.message || ""}`;

      if (seenErrors.has(errorSignature)) {
        console.log(`DEBUG | Skipping duplicate error: ${errorSignature}`);
        continue;
      }
      seenErrors.add(errorSignature);

      const level = (m.level || "").toLowerCase();
      const sev = level === "error" ? "ERROR" : level === "warning" ? "WARN" : "INFO";
      if (sev === "ERROR") errors++;
      else if (sev === "WARN") warnings++;

      outLines.push(`${sev} | ${code} | ${specRelPath}${loc} | ${m.message || ""}`.trim());
    }
  }

  // Output results
  const summary = `INFO | Runner | summary | Files scanned: ${specs.length}, Errors: ${errors}, Warnings: ${warnings}`;
  console.log(summary);

  // Write output file
  mkdirSync(dirname(outputFile), { recursive: true });
  writeFileSync(outputFile, outLines.concat([summary]).join("\n") + "\n", "utf8");

  // Handle failure conditions
  if (errors > 0 && env.FAIL_ON_ERRORS === "true") {
    const message = `Found ${errors} error(s) in validation`;
    if (core) core.setFailed(message);
    else {
      console.error(`ERROR | ${message}`);
      process.exit(1);
    }
  }

  return { specs: specs.length, errors, warnings };
}
