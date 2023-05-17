# OperationsApiTenantLevelOnly

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Operations-V1-02

## Description

The get operation endpoint for the operations API must be scoped tenant-wide. Operations should _not_ vary per subscription.

## How to fix the violation

Remove all paths for operations API at any level besides the tenant level.
