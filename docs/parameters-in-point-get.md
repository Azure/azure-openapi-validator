# ParametersInPointGet

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Get-V1-08

## Output Message

{param.name} is a query parameter. Point Get's MUST not have query parameters other than api version

## Description

Point Get's MUST not have query parameters other than api version.

## How to fix the violation

Ensure that, for a point GET no other query parameters except api-version are present.
