# Staging Lint Checks Workflow

## Overview

This workflow runs selected Azure OpenAPI validator rules against spec files from `azure-rest-api-specs` to test rule changes before they're merged.

## Features

### 🎯 Selective Rule Execution
Specify which rules to test via:
- **PR Labels**: Add labels like `test-PostResponseCodes`, `test-DeleteMustNotHaveRequestBody`
- **PR Body**: Add a line like `rules: PostResponseCodes, DeleteMustNotHaveRequestBody`

Priority: Labels take precedence over body if both are present.

### ⚡ Sparse Checkout Optimization

The workflow uses Git sparse checkout to dramatically reduce clone time and disk usage:

**Without sparse checkout:**
- Full `azure-rest-api-specs` repo: ~1GB+
- Clone time: 2-3 minutes

**With sparse checkout:**
- Only specified RPs: ~50-100MB
- Clone time: 10-20 seconds
- **10x faster checkout** ⚡

#### How it works:
```bash
# Clone with blob filter and sparse checkout enabled
git clone --filter=blob:none --sparse --depth=1 <repo>

# Only fetch needed folders
git sparse-checkout set specification/network specification/compute ...
```

### 🎛️ Configuration

Environment variables at the top of the workflow:

```yaml
env:
  SPEC_REPO: Azure/azure-rest-api-specs
  FAIL_ON_ERRORS: "false"  # Set to "true" to fail on errors
  MAX_FILES: "100"          # Safety cap for number of files scanned
  ALLOWED_RPS: "network,compute,monitor,sql,hdinsight,resource,storage"
```

#### ALLOWED_RPS

Controls which resource providers are:
1. **Checked out** via sparse checkout
2. **Scanned** by the runner script

Default RPs (7 total):
- `network` - Network resources (VNets, Load Balancers, etc.)
- `compute` - VMs, Scale Sets, Disks
- `monitor` - Metrics, Alerts, Diagnostics
- `sql` - SQL Databases, Managed Instances
- `hdinsight` - HDInsight clusters
- `resource` - Resource management operations
- `storage` - Storage accounts, Blobs, Files

**To test different RPs**, update the `ALLOWED_RPS` env variable.

### 📊 Scan Scope

The runner script only scans:
- Files under `specification/<rp>/resource-manager/stable/*.json`
- Up to `MAX_FILES` limit (default: 100)
- Only the resource providers listed in `ALLOWED_RPS`

This focused scope ensures fast test runs while covering representative specs.

## Usage Examples

### Test a specific rule via label
1. Add label: `test-PostResponseCodes` to your PR
2. Workflow runs automatically
3. Check the uploaded artifact for results

### Test multiple rules via PR body
```markdown
## Changes
Fixed validation logic for LRO operations

rules: PostResponseCodes, LongRunningOperationsWithLongRunningExtension
```

### Test against different RPs
Fork the workflow and modify:
```yaml
env:
  ALLOWED_RPS: "web,keyvault,containerservice"
```

## Performance Benchmarks

Typical workflow run times:

| Step | Time |
|------|------|
| Checkout validator repo | 5s |
| Setup Node.js | 10s |
| Sparse checkout specs | 15s |
| Install Rush dependencies | 60s |
| Build validator | 45s |
| Install AutoRest | 10s |
| Run rules (10 files) | 60s |
| **Total** | **~3-4 minutes** |

Without sparse checkout: **~5-6 minutes** (40% slower)

## Artifacts

The workflow always uploads findings to an artifact named `linter-findings`, even if the run fails. Download it from the Actions tab to see detailed results.

## Related Files

- `.github/scripts/extract-rule-names.js` - Extracts rule names from PR
- `.github/scripts/run-autorest-selected-rules.js` - Runs AutoRest with selected rules
- `.github/scripts/tests/` - Test suite for the scripts (Vitest)
