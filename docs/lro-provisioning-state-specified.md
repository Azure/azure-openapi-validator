# ProvisioningStateSpecified

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Async-V1-02

## Output Message

`${code} response in long running ${verb} operation is missing ProvisioningState property. A LRO PUT and PATCH operations response schema must have ProvisioningState specified.

## Description

This is a rule introduced to validate if a LRO PUT and PATCH operations response schema has "ProvisioningState" property specified.

## How to fix the violation

For a LRO PUT and PATCH operations, add "ProvisioningState" property to the response schema.
