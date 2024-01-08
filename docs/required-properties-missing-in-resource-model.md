# RequiredPropertiesMissingInResourceModel

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Get-V1-03, RPC-Put-V1-08

## Description

As per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md), a `Resource` model must have the `name`, `id` and `type` properties defined as `readOnly` in its hierarchy. `name`, `type` and `id` are readonly properties set by the service. 

## How to fix

Ensure the `Resource` type model has the properties `name`, `type` and `id` and they are marked as `readOnly:true`.
