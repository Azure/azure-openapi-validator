# DeleteResponseCodes

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Delete-V1-01

## Output Message

Synchronous DELETE must have 200 and 204 return code.
LRO DELETE must have 202 and 204 return code.

## Description

Synchronous DELETE must have 200 & 204 return codes and LRO DELETE must have 202 & 204 return codes.

## How to fix the violation

For an Synchronous DELETE specify 200 & 204 return codes and for LRO DELETE specify 202 and 204 return codes.
