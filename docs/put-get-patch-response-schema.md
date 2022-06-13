# PutGetPatchResponseSchema

## Category

ARM Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

{0} has different responses for PUT/GET/PATCH operations. The PUT/GET/PATCH operations must have same schema response.

## Description

For a given path with PUT, GET and PATCH operations, the schema of the response must be the same.

## Why the rule is important

This will provide a consistent experience to the user, i.e. the user could use the same model object to perform various operations. Also, within the SDK, this will encourage reuse of the same model objects.

## How to fix the violation

Ensure that, for a given path with PUT, GET and PATCH operations, the schema of the response is same. This might involve a service side change which will result in a breaking change in the generated SDK.
