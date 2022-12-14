# DeleteMustNotHaveRequestBody

## Category

SDK Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Delete-V1-02

## Output Message

'Delete' operation '{0}' must not have a request body.

## Description

The request body of a delete operation must be empty.

## Why the rule is important

This will ensure that the delete operation aligns with the [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md).

## How to fix the violation

Ensure that the request body of the delete operation is empty. This may involve a service side change and may cause a breaking change in the generated SDK.
