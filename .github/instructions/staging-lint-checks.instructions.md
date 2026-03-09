---
applyTo: .github/workflows/**
---

# Staging Lint Checks Workflow

## Overview

This workflow validates Azure OpenAPI validator rule changes by running selected rules against spec files from the
`azure-rest-api-specs` repository. It provides a staging environment to test new rules, rule modifications before they are
merged into the main codebase.

## Purpose and Intent

The workflow serves as a validation tool for linter rule development with the following workflow:

1. **Rule Development**: Engineers write new validation rules or modify existing ones
2. **Testing Setup**: Engineers create a PR and specify which rules to test via labels
3. **Automated Validation**: The workflow runs specified rules against live specification files using AutoRest
4. **Result Analysis**: Engineers review the output to identify false positives, false negatives, or unexpected behavior
5. **Quality Assurance**: Engineers and reviewers validate that rules work correctly before production release

**Important**: This workflow enforces three merge-blocking gates:

1. **Rule changes require test rules** — If rule files are modified, the PR must specify rules to test via labels
2. **Command failures block merges** — AutoRest crashes or script errors cause the workflow to fail
3. **Validation errors require acknowledgment** — When errors are found, the author must add an `errors-acknowledged` label after reviewing them

The workflow automatically re-runs when labels are added or removed.

## Validation Requirements

### When Rule Files Are Changed

If your PR modifies any of these files, you **must** specify test rules:

- `packages/rulesets/src/spectral/az-arm.ts`
- `packages/rulesets/src/spectral/az-common.ts`
- `packages/rulesets/src/spectral/az-dataplane.ts`
- `packages/rulesets/src/spectral/functions/*.ts`
- `packages/rulesets/src/native/legacyRules/**/*.ts`
- `packages/rulesets/src/native/functions/**/*.ts`
- `packages/rulesets/src/native/rulesets/**/*.ts`

The workflow will fail until test rules are specified.

### When Validation Errors Are Found

1. Download the `linter-findings` artifact and review the errors
2. Add the `errors-acknowledged` label to confirm you have reviewed them
3. The workflow re-runs automatically and passes (reviewer approval is still required)

Removing the label re-triggers the workflow and re-blocks the PR.

## How to Use

### Specifying Rules to Test

Add labels to your pull request with the format `test-<RuleName>`:

- `test-PostResponseCodes`
- `test-DeleteMustNotHaveRequestBody`
- `test-LongRunningOperationsWithLongRunningExtension`

### Workflow Configuration

The workflow can be configured through environment variables:

```yaml
env:
  SPEC_REPO: Azure/azure-rest-api-specs
  MAX_FILES: "100"
  ALLOWED_RPS: "compute,monitor,sql,hdinsight,network,resource,storage"
```

- **SPEC_REPO**: Source repository for OpenAPI specifications
- **MAX_FILES**: Maximum number of specification files to process
- **ALLOWED_RPS**: Comma-separated list of resource providers to include in testing

**Note**: These values can be modified directly in the `.github/workflows/staging-lint-checks.yaml` file to adjust the
workflow behavior based on testing requirements.

### Labels

| Label                 | Purpose                                                       |
| --------------------- | ------------------------------------------------------------- |
| `test-<RuleName>`     | Specifies a rule to validate (e.g., `test-PostResponseCodes`) |
| `errors-acknowledged` | Confirms the PR author has reviewed validation errors         |

## Debugging and Troubleshooting

### Viewing Results

1. Navigate to the Actions tab in your repository
2. Find the workflow run for your PR
3. Download the `linter-findings` artifact to see detailed validation results
4. The artifact contains output logs and any errors found

### Common Issues

**No rules detected**: Ensure your PR labels follow the exact format `test-<RuleName>`.

**Workflow fails**: Check the workflow logs for specific error messages. The artifact will still be uploaded
even if the workflow fails.

**Missing resource provider**: If testing rules against specifications from RPs not in the default list, update
the `ALLOWED_RPS` environment variable.

## Related Components

- `.github/workflows/src/extract-rule-names-and-run-validation.js`: Single consolidated script that parses rule names from PR labels and runs AutoRest with the selected rules over allowed spec files.
- GitHub Action workflow file: `.github/workflows/staging-lint-checks.yaml` orchestrates checkout, build, and script execution.
