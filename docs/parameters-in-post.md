# ParametersInPost

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Post-V1-05

## Output Message

{param.name} is a query parameter. Post operation must not contain query parameters.

## Description

For a POST action parameters MUST be in the payload and not in the URI.

## How to fix the violation

Ensure that, for a POST no other query parameters except api-version are present.
