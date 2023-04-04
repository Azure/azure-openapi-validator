# DeleteResponseCodes

## Category

ARM Error

## Applies to

ARM OpenAPI (swagger) specs

## Related ARM Guideline Code

- RPC-Delete-V1-01

## Output Message

Synchronous delete operations must have 200 and 204 return code responses.
Long-running (LRO) delete operations must have 202 and 204 return code responses.

## Description

Synchronous delete operations must have 200 & 204 return code responses and long-running (LRO) delete operations must have 202 & 204 return code responses.

## How to fix the violation

For synchronus delete operations, specify responses with 200 & 204 return codes.
For long-running (LRO) delete operations, specify  responses with 202 and 204 return codes.
