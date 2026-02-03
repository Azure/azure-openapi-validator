import { describe, expect, test, vi } from "vitest";
import {
  addPRComment,
  extractRuleNames,
  extractRulesFromBody,
  extractRulesFromLabels,
  hasExistingComment,
  hasLinterRuleChanges,
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

  describe("extractRulesFromBody", () => {
    test.each([
      {
        description: 'extracts rules from "rules:" line',
        body: "Some text\nrules: PostResponseCodes, DeleteMustNotHaveRequestBody\nMore text",
        expected: ["PostResponseCodes", "DeleteMustNotHaveRequestBody"],
      },
      {
        description: 'extracts rules from "rule:" line (singular)',
        body: "Some text\nrule: PostResponseCodes\nMore text",
        expected: ["PostResponseCodes"],
      },
      {
        description: "handles case-insensitive rules: prefix",
        body: "RULES: RuleOne\nRules: RuleTwo",
        expected: ["RuleOne", "RuleTwo"],
      },
      {
        description: "handles multiple rules on separate lines",
        body: "rules: RuleOne, RuleTwo\nrules: RuleThree",
        expected: ["RuleOne", "RuleTwo", "RuleThree"],
      },
      {
        description: "returns empty array when no rules found",
        body: "Just a regular PR description\nNo rules here",
        expected: [],
      },
      {
        description: "handles empty body",
        body: "",
        expected: [],
      },
      {
        description: "trims whitespace from rule names",
        body: "rules:  RuleOne  ,  RuleTwo  ",
        expected: ["RuleOne", "RuleTwo"],
      },
    ])("$description", ({ body, expected }) => {
      const result = extractRulesFromBody(body);
      expect(result).toEqual(expected);
    });
  });

  describe("extractRuleNames", () => {
    test.each([
      {
        description: "combines rules from labels and body",
        context: {
          payload: {
            pull_request: {
              labels: [{ name: "test-LabelRule" }],
              body: "rules: BodyRule",
            },
          },
        },
        expected: ["LabelRule", "BodyRule"],
      },
      {
        description: "extracts rules from labels only",
        context: {
          payload: {
            pull_request: {
              labels: [{ name: "test-RuleOne" }, { name: "test-RuleTwo" }],
              body: "",
            },
          },
        },
        expected: ["RuleOne", "RuleTwo"],
      },
      {
        description: "extracts rules from body when no test- labels present",
        context: {
          payload: {
            pull_request: {
              labels: [{ name: "bug" }, { name: "documentation" }],
              body: "rules: PostResponseCodes",
            },
          },
        },
        expected: ["PostResponseCodes"],
      },
      {
        description: "removes duplicates",
        context: {
          payload: {
            pull_request: {
              labels: [
                { name: "test-RuleOne" },
                { name: "test-RuleTwo" },
                { name: "test-RuleOne" },
              ],
              body: "rules: RuleTwo, RuleThree",
            },
          },
        },
        expected: ["RuleOne", "RuleTwo", "RuleThree"],
      },
      {
        description: "returns empty array when no rules found",
        context: {
          payload: {
            pull_request: {
              labels: [{ name: "bug" }],
              body: "No rules here",
            },
          },
        },
        expected: [],
      },
      {
        description: "handles empty labels and body",
        context: {
          payload: {
            pull_request: {
              labels: [],
              body: "",
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

  describe("hasLinterRuleChanges", () => {
    test("returns true when PR contains changes to spectral functions", async () => {
      const mockGithub = {
        rest: {
          pulls: {
            listFiles: vi.fn().mockResolvedValue({
              data: [
                { filename: "packages/rulesets/src/spectral/functions/test-rule.ts" },
                { filename: "README.md" },
              ],
            }),
          },
        },
      };
      const mockContext = {
        payload: {
          pull_request: { number: 123 },
        },
        repo: { owner: "owner", repo: "repo" },
      };

      const result = await hasLinterRuleChanges(mockGithub, mockContext);
      expect(result).toBe(true);
      expect(mockGithub.rest.pulls.listFiles).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
        pull_number: 123,
      });
    });

    test("returns true when PR contains changes to native functions", async () => {
      const mockGithub = {
        rest: {
          pulls: {
            listFiles: vi.fn().mockResolvedValue({
              data: [
                { filename: "packages/rulesets/src/native/functions/rule.ts" },
                { filename: "other-file.js" },
              ],
            }),
          },
        },
      };
      const mockContext = {
        payload: {
          pull_request: { number: 456 },
        },
        repo: { owner: "owner", repo: "repo" },
      };

      const result = await hasLinterRuleChanges(mockGithub, mockContext);
      expect(result).toBe(true);
    });

    test("returns false when PR does not contain rule changes", async () => {
      const mockGithub = {
        rest: {
          pulls: {
            listFiles: vi.fn().mockResolvedValue({
              data: [
                { filename: "README.md" },
                { filename: "src/other-file.ts" },
                { filename: "docs/guide.md" },
              ],
            }),
          },
        },
      };
      const mockContext = {
        payload: {
          pull_request: { number: 789 },
        },
        repo: { owner: "owner", repo: "repo" },
      };

      const result = await hasLinterRuleChanges(mockGithub, mockContext);
      expect(result).toBe(false);
    });

    test("returns false for files that contain path substring but are not in rule directories", async () => {
      const mockGithub = {
        rest: {
          pulls: {
            listFiles: vi.fn().mockResolvedValue({
              data: [
                // False positive candidates - path is in the middle or at the end
                { filename: "docs/packages/rulesets/src/spectral/functions/example.md" },
                { filename: "backup-packages/rulesets/src/native/functions/old.ts" },
                { filename: "test-packages/rulesets/src/spectral/functions/helper.ts" },
              ],
            }),
          },
        },
      };
      const mockContext = {
        payload: {
          pull_request: { number: 999 },
        },
        repo: { owner: "owner", repo: "repo" },
      };

      const result = await hasLinterRuleChanges(mockGithub, mockContext);
      expect(result).toBe(false);
    });

    test("returns false when no pull request in context", async () => {
      const mockGithub = {
        rest: {
          pulls: {
            listFiles: vi.fn(),
          },
        },
      };
      const mockContext = {
        payload: {},
        repo: { owner: "owner", repo: "repo" },
      };

      const result = await hasLinterRuleChanges(mockGithub, mockContext);
      expect(result).toBe(false);
      expect(mockGithub.rest.pulls.listFiles).not.toHaveBeenCalled();
    });

    test("returns false when API call fails", async () => {
      const mockGithub = {
        rest: {
          pulls: {
            listFiles: vi.fn().mockRejectedValue(new Error("API Error")),
          },
        },
      };
      const mockContext = {
        payload: {
          pull_request: { number: 999 },
        },
        repo: { owner: "owner", repo: "repo" },
      };

      const result = await hasLinterRuleChanges(mockGithub, mockContext);
      expect(result).toBe(false);
    });
  });

  describe("addPRComment", () => {
    test("successfully adds comment to PR", async () => {
      const mockGithub = {
        rest: {
          issues: {
            createComment: vi.fn().mockResolvedValue({}),
          },
        },
      };
      const mockContext = {
        payload: {
          pull_request: { number: 123 },
        },
        repo: { owner: "owner", repo: "repo" },
      };
      const commentBody = "Test comment";

      await addPRComment(mockGithub, mockContext, commentBody);

      expect(mockGithub.rest.issues.createComment).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
        issue_number: 123,
        body: commentBody,
      });
    });

    test("handles missing pull request in context", async () => {
      const mockGithub = {
        rest: {
          issues: {
            createComment: vi.fn(),
          },
        },
      };
      const mockContext = {
        payload: {},
        repo: { owner: "owner", repo: "repo" },
      };

      await addPRComment(mockGithub, mockContext, "Test");

      expect(mockGithub.rest.issues.createComment).not.toHaveBeenCalled();
    });

    test("handles API errors gracefully", async () => {
      const mockGithub = {
        rest: {
          issues: {
            createComment: vi.fn().mockRejectedValue(new Error("API Error")),
          },
        },
      };
      const mockContext = {
        payload: {
          pull_request: { number: 789 },
        },
        repo: { owner: "owner", repo: "repo" },
      };

      // Should not throw
      await expect(addPRComment(mockGithub, mockContext, "Test")).resolves.toBeUndefined();
    });
  });

  describe("hasExistingComment", () => {
    test("returns true when a comment with the marker exists", async () => {
      const mockGithub = {
        rest: {
          issues: {
            listComments: vi.fn().mockResolvedValue({
              data: [
                { body: "Some other comment" },
                { body: "<!-- staging-lint-checks-reminder -->\nLinter rule changes detected" },
                { body: "Another comment" },
              ],
            }),
          },
        },
      };
      const mockContext = {
        payload: {
          pull_request: { number: 123 },
        },
        repo: { owner: "owner", repo: "repo" },
      };
      const marker = "<!-- staging-lint-checks-reminder -->";

      const result = await hasExistingComment(mockGithub, mockContext, marker);
      expect(result).toBe(true);
      expect(mockGithub.rest.issues.listComments).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
        issue_number: 123,
      });
    });

    test("returns false when no comment with the marker exists", async () => {
      const mockGithub = {
        rest: {
          issues: {
            listComments: vi.fn().mockResolvedValue({
              data: [
                { body: "Some comment" },
                { body: "Another comment" },
              ],
            }),
          },
        },
      };
      const mockContext = {
        payload: {
          pull_request: { number: 456 },
        },
        repo: { owner: "owner", repo: "repo" },
      };
      const marker = "<!-- staging-lint-checks-reminder -->";

      const result = await hasExistingComment(mockGithub, mockContext, marker);
      expect(result).toBe(false);
    });

    test("returns false when no pull request in context", async () => {
      const mockGithub = {
        rest: {
          issues: {
            listComments: vi.fn(),
          },
        },
      };
      const mockContext = {
        payload: {},
        repo: { owner: "owner", repo: "repo" },
      };
      const marker = "<!-- staging-lint-checks-reminder -->";

      const result = await hasExistingComment(mockGithub, mockContext, marker);
      expect(result).toBe(false);
      expect(mockGithub.rest.issues.listComments).not.toHaveBeenCalled();
    });

    test("returns false when API call fails", async () => {
      const mockGithub = {
        rest: {
          issues: {
            listComments: vi.fn().mockRejectedValue(new Error("API Error")),
          },
        },
      };
      const mockContext = {
        payload: {
          pull_request: { number: 789 },
        },
        repo: { owner: "owner", repo: "repo" },
      };
      const marker = "<!-- staging-lint-checks-reminder -->";

      const result = await hasExistingComment(mockGithub, mockContext, marker);
      expect(result).toBe(false);
    });

    test("handles comments with null body", async () => {
      const mockGithub = {
        rest: {
          issues: {
            listComments: vi.fn().mockResolvedValue({
              data: [
                { body: null },
                { body: undefined },
                { body: "Valid comment" },
              ],
            }),
          },
        },
      };
      const mockContext = {
        payload: {
          pull_request: { number: 999 },
        },
        repo: { owner: "owner", repo: "repo" },
      };
      const marker = "some-marker";

      const result = await hasExistingComment(mockGithub, mockContext, marker);
      expect(result).toBe(false);
    });
  });
});
