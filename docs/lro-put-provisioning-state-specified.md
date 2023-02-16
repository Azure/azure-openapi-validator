# ProvisioningStateSpecifiedForLROPut

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Async-V1-02

## Output Message

{code} response schema in long running PUT operation is missing ProvisioningState property. A LRO PUT operations response schema must have ProvisioningState specified.

## Description

This is a rule introduced to validate if a LRO PUT operations response schema has "ProvisioningState" property specified for the 200 and 201 status codes.

## How to fix the violation

For an LRO PUT add "ProvisioningState" property to the response schema of 200 and 201 status codes.
