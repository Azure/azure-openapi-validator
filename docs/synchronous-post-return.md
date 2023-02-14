# SyncPostReturn

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Post-V1-02

## Output Message

A synchronous POST operation must have either 200 or 204 return codes.
The 200 response code has missing schema. 200 response for a synchronous POST operation must have a response schema specified.
Schema defined in 204 response code. 204 response for a synchronous POST operation must not have a response schema specified.

## Description

A long running Post operation should return 200 with response schema and 202 without response schema.

## How to fix the violation

Ensure that, for a lro POST 200 with response schema and 202 without response schema are specified.
