# PutGetPatchResponseSchema

## Category

ARM Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Put-V1-12

## Description

For a given path with PUT, GET and PATCH operations, the schema of the response must be the same. Having the same response will provide a consistent experience to the user, i.e. the user could use the same model object to perform various operations. Also, within the SDK, this will encourage reuse of the same model objects.

## How to fix

Ensure that, for a given path with PUT, GET and PATCH operations, the schema of the response is same.
