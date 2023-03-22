# PatchResponseCode

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Patch-V1-06

## Output Message

Synchronous PATCH must have 200 return code.
LRO PATCH must have 200 and 202 return code.

## Description

Synchronous PATCH must have 200 return code and LRO PATCH must have 200 and 202 return codes.

## How to fix the violation

For an Synchronous PATCH specify 200 return code and for LRO PATCH specify 200 and 202 return codes.