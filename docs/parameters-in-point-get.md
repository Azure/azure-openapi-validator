# ParametersInPointGet

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Get-V1-08

## Output Message

Query parameter {0} should be removed. Point gets MUST not have query parameters other than API version

## Description

Point Get's MUST not have query parameters other than api version.

## How to fix the violation

Ensure that no query parameters are present for point get operations, except for api-version.
