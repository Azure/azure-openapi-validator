import { describe, expect, test, vi } from "vitest";
import {
  checkBlockingConditions,
  detectRuleChanges,
  extractRuleNames,
  extractRulesFromLabels,
  RULE_FILE_PATTERN,
} from "../src/extract-rule-names-and-run-validation.js";

describe("extract-rule-names", () => {
  describe("extractRulesFromLabels", () => {
    test.each([
      {
        description: "extracts rules from test- prefixed labels",
        labels: ["test-PostResponseCodes", "test-DeleteMustNotHaveRequestBody", "bug"],
        expected: ["PostResponseCodes", "DeleteMustNotHaveRequestBody"],
      },
      {
        description: "handles case-insensitive test- prefix",
        labels: ["TEST-RuleOne", "Test-RuleTwo", "test-RuleThree"],
        expected: ["RuleOne", "RuleTwo", "RuleThree"],
      },
      {
        description: "returns empty array when no test- labels",
        labels: ["bug", "documentation", "enhancement"],
        expected: [],
      },
      {
        description: "handles empty array",
        labels: [],
        expected: [],
      },
      {
        description: "trims whitespace from rule names",
        labels: ["test- RuleOne ", "test-  RuleTwo  "],
        expected: ["RuleOne", "RuleTwo"],
      },
      {
        description: "handles label objects with name property (GitHub API format)",
        labels: [{ name: "test-RuleOne" }, { name: "test-RuleTwo" }, { name: "bug" }],
        expected: ["RuleOne", "RuleTwo"],
      },
    ])("$description", ({ labels, expected }) => {
      const result = extractRulesFromLabels(labels);
      expect(result).toEqual(expected);
    });
  });

  describe("extractRuleNames", () => {
    test.each([
      {
        description: "extracts rules from labels",
        context: {
          payload: {
            pull_request: {
              labels: [{ name: "test-RuleOne" }, { name: "test-RuleTwo" }],
            },
          },
        },
        expected: ["RuleOne", "RuleTwo"],
      },
      {
        description: "ignores non-test labels",
        context: {
          payload: {
            pull_request: {
              labels: [{ name: "bug" }, { name: "documentation" }],
            },
          },
        },
        expected: [],
      },
      {
        description: "returns empty array when no rules found",
        context: {
          payload: {
            pull_request: {
              labels: [{ name: "bug" }],
            },
          },
        },
        expected: [],
      },
      {
        description: "handles empty labels",
        context: {
          payload: {
            pull_request: {
              labels: [],
            },
          },
        },
        expected: [],
      },
      {
        description: "returns empty array when no pull request in context",
        context: { payload: {} },
        expected: [],
      },
    ])("$description", ({ context, expected }) => {
      const result = extractRuleNames(context);
      expect(result).toEqual(expected);
    });
  });

  describe("checkBlockingConditions", () => {
    function mockCore() {
      return {
        setFailed: vi.fn(),
        warning: vi.fn(),
        notice: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        debug: vi.fn(),
      };
    }

    test("blocks on command failures", () => {
      const core = mockCore();
      const context = { payload: { pull_request: { labels: [] } } };
      const result = { specs: 10, errors: 0, warnings: 0, commandFailures: 2 };

      checkBlockingConditions({ context, core, result });

      expect(core.setFailed).toHaveBeenCalledWith(expect.stringContaining("2 command failure(s)"));
    });

    test("blocks on validation errors without acknowledgment label", () => {
      const core = mockCore();
      const context = { payload: { pull_request: { labels: [{ name: "bug" }] } } };
      const result = { specs: 10, errors: 3, warnings: 1, commandFailures: 0 };

      checkBlockingConditions({ context, core, result });

      expect(core.setFailed).toHaveBeenCalledWith(expect.stringContaining("3 validation error(s)"));
    });

    test("passes with errors when errors-acknowledged label is present", () => {
      const core = mockCore();
      const context = {
        payload: {
          pull_request: { labels: [{ name: "errors-acknowledged" }] },
        },
      };
      const result = { specs: 10, errors: 3, warnings: 1, commandFailures: 0 };

      checkBlockingConditions({ context, core, result });

      expect(core.setFailed).not.toHaveBeenCalled();
      expect(core.warning).toHaveBeenCalledWith(expect.stringContaining("errors-acknowledged"));
    });

    test("does not block when no errors or command failures", () => {
      const core = mockCore();
      const context = { payload: { pull_request: { labels: [] } } };
      const result = { specs: 10, errors: 0, warnings: 5, commandFailures: 0 };

      checkBlockingConditions({ context, core, result });

      expect(core.setFailed).not.toHaveBeenCalled();
    });

    test("command failures take priority over validation errors", () => {
      const core = mockCore();
      const context = { payload: { pull_request: { labels: [] } } };
      const result = { specs: 10, errors: 5, warnings: 0, commandFailures: 1 };

      checkBlockingConditions({ context, core, result });

      // Should only be called once (for command failures)
      expect(core.setFailed).toHaveBeenCalledTimes(1);
      expect(core.setFailed).toHaveBeenCalledWith(expect.stringContaining("command failure(s)"));
    });
  });

  describe("RULE_FILE_PATTERN", () => {
    test.each([
      {
        description: "matches spectral az-arm rule file",
        path: "packages/rulesets/src/spectral/az-arm.ts",
        expected: true,
      },
      {
        description: "matches spectral az-common rule file",
        path: "packages/rulesets/src/spectral/az-common.ts",
        expected: true,
      },
      {
        description: "matches spectral az-dataplane rule file",
        path: "packages/rulesets/src/spectral/az-dataplane.ts",
        expected: true,
      },
      {
        description: "matches spectral function file",
        path: "packages/rulesets/src/spectral/functions/post-response-codes.ts",
        expected: true,
      },
      {
        description: "matches native legacyRules file",
        path: "packages/rulesets/src/native/legacyRules/SomeRule.ts",
        expected: true,
      },
      {
        description: "matches native functions file",
        path: "packages/rulesets/src/native/functions/SomeFunc.ts",
        expected: true,
      },
      {
        description: "matches native rulesets file",
        path: "packages/rulesets/src/native/rulesets/arm.ts",
        expected: true,
      },
      {
        description: "does not match unrelated files",
        path: "packages/rulesets/src/spectral/README.md",
        expected: false,
      },
      {
        description: "does not match test files",
        path: "packages/rulesets/src/spectral/test/some-test.ts",
        expected: false,
      },
      {
        description: "does not match non-.ts files in functions",
        path: "packages/rulesets/src/spectral/functions/helper.js",
        expected: false,
      },
    ])("$description", ({ path, expected }) => {
      expect(RULE_FILE_PATTERN.test(path)).toBe(expected);
    });
  });

  describe("detectRuleChanges", () => {
    test("returns true when rule files are changed", async () => {
      const mockPaginate = vi.fn().mockResolvedValue([
        {
          filename: "packages/rulesets/src/spectral/functions/post-response-codes.ts",
          status: "modified",
        },
        { filename: "README.md", status: "modified" },
      ]);
      const github = {
        paginate: mockPaginate,
        rest: { pulls: { listFiles: "listFiles" } },
      };
      const context = {
        payload: { pull_request: { number: 42 } },
        repo: { owner: "Azure", repo: "azure-openapi-validator" },
      };

      const result = await detectRuleChanges(github, context);

      expect(result).toBe(true);
      expect(mockPaginate).toHaveBeenCalledWith("listFiles", {
        owner: "Azure",
        repo: "azure-openapi-validator",
        pull_number: 42,
        per_page: 100,
      });
    });

    test("returns false when no rule files are changed", async () => {
      const mockPaginate = vi.fn().mockResolvedValue([
        { filename: "README.md", status: "modified" },
        { filename: "package.json", status: "modified" },
      ]);
      const github = {
        paginate: mockPaginate,
        rest: { pulls: { listFiles: "listFiles" } },
      };
      const context = {
        payload: { pull_request: { number: 42 } },
        repo: { owner: "Azure", repo: "azure-openapi-validator" },
      };

      const result = await detectRuleChanges(github, context);

      expect(result).toBe(false);
    });

    test("returns false when no pull request in context", async () => {
      const github = { paginate: vi.fn(), rest: { pulls: { listFiles: "listFiles" } } };
      const context = { payload: {}, repo: { owner: "Azure", repo: "azure-openapi-validator" } };

      const result = await detectRuleChanges(github, context);

      expect(result).toBe(false);
      expect(github.paginate).not.toHaveBeenCalled();
    });

    test("ignores deleted rule files", async () => {
      const mockPaginate = vi
        .fn()
        .mockResolvedValue([
          { filename: "packages/rulesets/src/spectral/az-arm.ts", status: "removed" },
        ]);
      const github = {
        paginate: mockPaginate,
        rest: { pulls: { listFiles: "listFiles" } },
      };
      const context = {
        payload: { pull_request: { number: 42 } },
        repo: { owner: "Azure", repo: "azure-openapi-validator" },
      };

      const result = await detectRuleChanges(github, context);

      expect(result).toBe(false);
    });
  });
});
