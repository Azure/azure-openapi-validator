# Staging Lint Checks Workflow

## Overview

This workflow validates Azure OpenAPI validator rule changes by running selected rules against spec files from the
`azure-rest-api-specs` repository. It provides a staging environment to test new rules, rule modifications before they are
merged into the main codebase.

## Purpose and Intent

The workflow serves as a validation tool for linter rule development with the following workflow:

1. **Rule Development**: Engineers write new validation rules or modify existing ones
2. **Testing Setup**: Engineers create a PR and specify which rules to test via labels or PR description
3. **Automated Validation**: The workflow runs specified rules against live specification files using AutoRest
4. **Result Analysis**: Engineers review the output to identify false positives, false negatives, or unexpected behavior
5. **Quality Assurance**: Engineers and reviewers validate that rules work correctly before production release

**Important**: This workflow is designed to assist validation, not to block PR merging. The responsibility for
ensuring rule quality lies with the engineer and reviewer based on the workflow output.

## How to Use

### Specifying Rules to Test

You can specify which validation rules to test using either of these methods:

#### Method 1: PR Labels

Add labels to your pull request with the format `test-<RuleName>`:

- `test-PostResponseCodes`
- `test-DeleteMustNotHaveRequestBody`
- `test-LongRunningOperationsWithLongRunningExtension`

#### Method 2: PR Description

Add a line in your PR body:

```text
rules: PostResponseCodes, DeleteMustNotHaveRequestBody
```

Note: If both methods are used, PR labels take precedence.

### Workflow Configuration

The workflow can be configured through environment variables:

```yaml
env:
  SPEC_REPO: Azure/azure-rest-api-specs
  FAIL_ON_ERRORS: "false"
  MAX_FILES: "100"
  ALLOWED_RPS: "network,compute,monitor,sql,hdinsight,resource,storage"
```

- **SPEC_REPO**: Source repository for OpenAPI specifications
- **FAIL_ON_ERRORS**: Whether the workflow should fail when validation errors are found
- **MAX_FILES**: Maximum number of specification files to process
- **ALLOWED_RPS**: Comma-separated list of resource providers to include in testing

### Supported Resource Providers

The default configuration includes these resource providers:

- network: Virtual networks, load balancers, network interfaces
- compute: Virtual machines, scale sets, disks
- monitor: Monitoring, metrics, alerts
- sql: SQL databases and managed instances
- hdinsight: HDInsight cluster services
- resource: Resource management operations
- storage: Storage accounts and services

## Debugging and Troubleshooting

### Viewing Results

1. Navigate to the Actions tab in your repository
2. Find the workflow run for your PR
3. Download the `linter-findings` artifact to see detailed validation results
4. The artifact contains output logs and any errors found

### Common Issues

**No rules detected**: Ensure your PR labels follow the exact format `test-<RuleName>` or verify the rules line
in your PR description is properly formatted.

**Workflow fails**: Check the workflow logs for specific error messages. The artifact will still be uploaded
even if the workflow fails.

**Missing resource provider**: If testing rules against specifications from RPs not in the default list, update
the `ALLOWED_RPS` environment variable.

## Related Components

- `.github/scripts/extract-rule-names.js`: Parses rule names from PR labels and body
- `.github/scripts/run-autorest-selected-rules.js`: Executes validation rules against specifications
- `.github/scripts/tests/`: Test suite validating script functionality
