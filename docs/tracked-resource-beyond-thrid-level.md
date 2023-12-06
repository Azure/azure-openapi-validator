# TrackedResourceBeyondsThirdLevel

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Put-V1-19

## Description

Tracked resources must not be used beyond the third level of nesting.

## How to fix

Avoid the third level nested tracked resource. You may model such resources as proxy resources instead. Having a tracked resource beyond the third level may lead to a loss of functionality in ARM.
