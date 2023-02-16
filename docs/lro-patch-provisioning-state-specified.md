# ProvisioningStateSpecifiedForLROPatch

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Async-V1-02

## Output Message

200 response schema in long running PATCH operation is missing ProvisioningState property. A LRO PATCH operations 200 response schema must have ProvisioningState specified.

## Description

This is a rule introduced to validate if a LRO PATCH operations response schema has "ProvisioningState" property specified for the 200 status code.

## How to fix the violation

For an LRO PATCH add "ProvisioningState" property to the response schema of 200 status code.
