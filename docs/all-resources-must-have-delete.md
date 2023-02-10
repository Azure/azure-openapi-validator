# AllResourcesMustHaveDelete

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Delete-V1-03

## Output Message

The resource {resourceName} does not have a corresponding delete operation.

## Description

All proxy and tracked resources MUST support delete.

## CreatedAt

July 07, 2022

## LastModifiedAt

Feb 10, 2023

## How to fix the violation

Adding the put operation for tracked resource.
