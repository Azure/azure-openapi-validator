# ResponseSchemaSpecifiedForSuccessStatusCode

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Put-V1-24

## Output Message

The 200 and 201 success status code have missing response schema. They must have a response schema specified.

## Description

Validates if 200 & 201 success status codes for an ARM PUT operation has a response schema specified.

## How to fix the violation

Ensure that, for 200 & 201 success status codes in a PUT has response schema specified.
