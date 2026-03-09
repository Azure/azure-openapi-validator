// @ts-check

/**
 * Parse artifact names to determine label actions.
 * Artifacts named "label-<name>=true" should add the label.
 * Artifacts named "label-<name>=false" should remove the label.
 *
 * @param {string[]} artifactNames
 * @returns {{ labelsToAdd: string[], labelsToRemove: string[] }}
 */
export function parseLabelArtifacts(artifactNames) {
  /** @type {string[]} */
  const labelsToAdd = [];
  /** @type {string[]} */
  const labelsToRemove = [];

  for (const name of artifactNames) {
    const firstEquals = name.indexOf("=");
    if (firstEquals === -1) continue;

    const key = name.substring(0, firstEquals);
    const value = name.substring(firstEquals + 1);

    if (!key.startsWith("label-")) continue;

    const labelName = key.substring("label-".length);
    if (!labelName) continue;

    if (value === "true") {
      labelsToAdd.push(labelName);
    } else if (value === "false") {
      labelsToRemove.push(labelName);
    }
  }

  return { labelsToAdd, labelsToRemove };
}

// TODO: Add tests for the github-script integration
/* v8 ignore start */
/**
 * Main update-labels function for GitHub Actions.
 * Reads label artifacts from the triggering workflow run and adds/removes labels on the associated PR.
 *
 * @param {import('@actions/github-script').AsyncFunctionArguments} AsyncFunctionArguments
 */
export default async function updateLabels({ github, context, core }) {
  const workflowRun = /** @type {any} */ (context.payload).workflow_run;
  if (!workflowRun) {
    throw new Error("No workflow_run in payload");
  }

  const owner = context.repo.owner;
  const repo = context.repo.repo;
  const run_id = workflowRun.id;

  // Get PR number from the workflow run's associated pull requests
  const pull_requests = workflowRun.pull_requests;
  if (!pull_requests || pull_requests.length === 0) {
    core.info("No pull requests associated with this workflow run");
    return;
  }

  const issue_number = pull_requests[0].number;
  core.info(`Processing PR #${issue_number}`);

  await updateLabelsImpl({ owner, repo, run_id, issue_number, github, core });
}
/* v8 ignore stop */

/**
 * Update labels on a PR based on artifacts from a workflow run.
 *
 * @param {Object} params
 * @param {string} params.owner
 * @param {string} params.repo
 * @param {number} params.run_id
 * @param {number} params.issue_number
 * @param {(import("@octokit/core").Octokit & import("@octokit/plugin-rest-endpoint-methods/dist-types/types.js").Api & { paginate: import("@octokit/plugin-paginate-rest").PaginateInterface; })} params.github
 * @param {typeof import("@actions/core")} params.core
 */
export async function updateLabelsImpl({ owner, repo, run_id, issue_number, github, core }) {
  const artifacts = await github.paginate(github.rest.actions.listWorkflowRunArtifacts, {
    owner,
    repo,
    run_id,
    per_page: 100,
  });

  const artifactNames = artifacts.map((/** @type {any} */ a) => a.name);
  core.info(`artifactNames: ${JSON.stringify(artifactNames)}`);

  const { labelsToAdd, labelsToRemove } = parseLabelArtifacts(artifactNames);

  core.info(`labelsToAdd: ${JSON.stringify(labelsToAdd)}`);
  core.info(`labelsToRemove: ${JSON.stringify(labelsToRemove)}`);

  if (labelsToAdd.length > 0) {
    await github.rest.issues.addLabels({
      owner,
      repo,
      issue_number,
      labels: labelsToAdd,
    });
  }

  for (const name of labelsToRemove) {
    try {
      await github.rest.issues.removeLabel({
        owner,
        repo,
        issue_number,
        name,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        "status" in error &&
        /** @type {any} */ (error).status === 404
      ) {
        core.info(`Label '${name}' not found on PR #${issue_number}, skipping`);
      } else {
        throw error;
      }
    }
  }
}
