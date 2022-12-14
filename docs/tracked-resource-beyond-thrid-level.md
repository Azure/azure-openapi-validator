# TrackedResourceBeyondsThirdLevel

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Put-V1-19

## Output Message

The tracked resource {resourceName} is beyond third level of nesting.

## Description

Tracked resources must not be used beyond the third level of nesting.

## CreatedAt

July 07, 2022

## LastModifiedAt

July 07, 2022

## How to fix the violation

Avoid the third level nested tracked resource, you should try to decrease the nested levels.
