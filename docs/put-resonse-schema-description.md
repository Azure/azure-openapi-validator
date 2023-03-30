# PutResponseSchemaDescription

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Put-V1-11

## Output Message

Any Put MUST contain 200 and 201 return codes.
Description of 200 response code of a PUT operation MUST include term "update".
Description of 201 response code of a PUT operation MUST include term "create".

## Description

For any PUT, response code should be 201 if resource was newly created and 200 if updated.

## How to fix the violation

Ensure that, for a any PUT 200 & 201 return codes are specified and 200 response schema has term "update" & 201 response schema has term "create".