# AllProxyResourcesShouldHaveDelete

## Category

ARM Warning

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Delete-V1-05

## Output Message

The resource {resourceName} does not have a corresponding delete operation.

## Description

All proxy resources SHOULD support delete.

## CreatedAt

July 07, 2022

## LastModifiedAt

Feb 10, 2023

## How to fix the violation

Adding the put operation for tracked resource.
