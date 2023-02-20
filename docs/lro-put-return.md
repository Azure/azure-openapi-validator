# LroPutReturn

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Async-V1-01

## Output Message

The async put operation must have bot 200 and 201 response code.

## Description

A long running put operation should have 201(Created) or 200 OK (per normal guidance) response code.

## How to fix the violation

Ensure that, for a lro PUT 200 and 201 with response code.
