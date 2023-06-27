# PatchResponseCodes

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Patch-V1-06

## Output Message

Synchronous PATCH must have 200 and default return codes. They also must not have other response codes.
LRO PATCH must have 200 and 202 and default return codes. They also must not have other response codes.


## Description

Synchronous PATCH must have 200 return code and LRO PATCH must have 200 and 202 return codes.

## How to fix the violation

For an Synchronous PATCH add 200 and default return codes and make sure they don't have other response codes.
For LRO PATCH add 200, 202 and default return codes and make sure they don't have other response codes.