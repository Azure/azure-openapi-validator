# SyncPostReturn

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Post-V1-02

## Output Message

A synchronous POST operation must have either 200 or 204 return codes.
200 response for a synchronous POST operation must have a response schema specified.
204 response for a synchronous POST operation must not have a response schema specified.

## Description

A synchronous Post operation should return 200 with response schema or 204 without response schema.

## How to fix the violation

Ensure that, for a synchronous POST 200 with response schema or 204 without response schema are specified.
