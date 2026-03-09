import { describe, expect, test, vi } from "vitest";
import { parseLabelArtifacts, updateLabelsImpl } from "../src/update-labels.js";

describe("parseLabelArtifacts", () => {
  test("removes label when artifact value is false", () => {
    const { labelsToAdd, labelsToRemove } = parseLabelArtifacts(["label-ARMReviewRequired=false"]);
    expect(labelsToAdd).toEqual([]);
    expect(labelsToRemove).toEqual(["ARMReviewRequired"]);
  });

  test("adds label when artifact value is true", () => {
    const { labelsToAdd, labelsToRemove } = parseLabelArtifacts(["label-ARMReviewRequired=true"]);
    expect(labelsToAdd).toEqual(["ARMReviewRequired"]);
    expect(labelsToRemove).toEqual([]);
  });

  test("ignores non-label artifacts", () => {
    const { labelsToAdd, labelsToRemove } = parseLabelArtifacts([
      "linter-findings",
      "issue-number=42",
    ]);
    expect(labelsToAdd).toEqual([]);
    expect(labelsToRemove).toEqual([]);
  });

  test("handles multiple label artifacts", () => {
    const { labelsToAdd, labelsToRemove } = parseLabelArtifacts([
      "label-ARMReviewRequired=false",
      "label-SomeOtherLabel=true",
    ]);
    expect(labelsToAdd).toEqual(["SomeOtherLabel"]);
    expect(labelsToRemove).toEqual(["ARMReviewRequired"]);
  });

  test("ignores label artifacts with invalid values", () => {
    const { labelsToAdd, labelsToRemove } = parseLabelArtifacts([
      "label-ARMReviewRequired=invalid",
    ]);
    expect(labelsToAdd).toEqual([]);
    expect(labelsToRemove).toEqual([]);
  });

  test("returns empty arrays for empty artifact list", () => {
    const { labelsToAdd, labelsToRemove } = parseLabelArtifacts([]);
    expect(labelsToAdd).toEqual([]);
    expect(labelsToRemove).toEqual([]);
  });

  test("ignores label- artifact with no label name", () => {
    const { labelsToAdd, labelsToRemove } = parseLabelArtifacts(["label-=true"]);
    expect(labelsToAdd).toEqual([]);
    expect(labelsToRemove).toEqual([]);
  });

  test("ignores artifacts with no equals sign", () => {
    const { labelsToAdd, labelsToRemove } = parseLabelArtifacts(["label-ARMReviewRequired"]);
    expect(labelsToAdd).toEqual([]);
    expect(labelsToRemove).toEqual([]);
  });
});

describe("updateLabelsImpl", () => {
  function createMockGithub(artifactNames = [], removeStatus = 200) {
    return {
      paginate: vi.fn().mockResolvedValue(artifactNames.map((name) => ({ name }))),
      rest: {
        issues: {
          addLabels: vi.fn().mockResolvedValue({}),
          removeLabel: vi.fn().mockImplementation(() => {
            if (removeStatus === 404) {
              const err = Object.assign(new Error("Not Found"), { status: 404 });
              return Promise.reject(err);
            }
            return Promise.resolve({});
          }),
        },
        actions: {
          listWorkflowRunArtifacts: vi.fn(),
        },
      },
    };
  }

  const mockCore = {
    info: vi.fn(),
    warning: vi.fn(),
    setFailed: vi.fn(),
  };

  test("removes label when label-ARMReviewRequired=false artifact exists", async () => {
    const github = createMockGithub(["label-ARMReviewRequired=false"]);
    await updateLabelsImpl({
      owner: "Azure",
      repo: "azure-rest-api-specs",
      run_id: 12345,
      issue_number: 42,
      github,
      core: mockCore,
    });
    expect(github.rest.issues.removeLabel).toHaveBeenCalledWith({
      owner: "Azure",
      repo: "azure-rest-api-specs",
      issue_number: 42,
      name: "ARMReviewRequired",
    });
    expect(github.rest.issues.addLabels).not.toHaveBeenCalled();
  });

  test("adds label when label-ARMReviewRequired=true artifact exists", async () => {
    const github = createMockGithub(["label-ARMReviewRequired=true"]);
    await updateLabelsImpl({
      owner: "Azure",
      repo: "azure-rest-api-specs",
      run_id: 12345,
      issue_number: 42,
      github,
      core: mockCore,
    });
    expect(github.rest.issues.addLabels).toHaveBeenCalledWith({
      owner: "Azure",
      repo: "azure-rest-api-specs",
      issue_number: 42,
      labels: ["ARMReviewRequired"],
    });
    expect(github.rest.issues.removeLabel).not.toHaveBeenCalled();
  });

  test("does nothing when no label artifacts exist", async () => {
    const github = createMockGithub(["linter-findings"]);
    await updateLabelsImpl({
      owner: "Azure",
      repo: "azure-rest-api-specs",
      run_id: 12345,
      issue_number: 42,
      github,
      core: mockCore,
    });
    expect(github.rest.issues.addLabels).not.toHaveBeenCalled();
    expect(github.rest.issues.removeLabel).not.toHaveBeenCalled();
  });

  test("ignores 404 error when removing a label that doesn't exist on PR", async () => {
    const github = createMockGithub(["label-ARMReviewRequired=false"], 404);
    await expect(
      updateLabelsImpl({
        owner: "Azure",
        repo: "azure-rest-api-specs",
        run_id: 12345,
        issue_number: 42,
        github,
        core: mockCore,
      }),
    ).resolves.not.toThrow();
  });
});
