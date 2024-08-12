# DeleteResponseCodes

## Category

ARM Error

## Applies to

ARM OpenAPI (swagger) specs

## Related ARM Guideline Code

- RPC-Delete-V1-01

## Output Message

Synchronous delete operations must have 200, 204, and default responses. They must not have any other responses.
Long-running (LRO) delete operations must have 202, 204, and default responses. They must not have any other responses.

## Description

Synchronous delete operations must have 200, 204, and default responses and long-running (LRO) delete operations must have 202, 204, and default responses. They must not have any other responses.

## How to fix the violation

For synchronous delete operations, specify responses with 200 & 204 return codes.
For long-running (LRO) delete operations, specify responses with 202 and 204 return codes.
202 response for a LRO DELETE operation must not have a response schema specified.
