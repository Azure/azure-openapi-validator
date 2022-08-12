# RequiredPropertiesMissingInResourceModel

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-V2-GET-03

## Output Message

Model definition '{0}' must have the properties 'name', 'id' and 'type' in its hierarchy and these properties must be marked as readonly.

## Description

Per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md), a `Resource` model must have the `name`, `id` and `type` properties defined as `readOnly` in its hierarchy.

## Why the rule is important

`name`, `type` and `id` are readonly properties set on the service end. Also, per ARM guidelines each `Resource` type model must have these properties defined in its hierarchy. An example `Resource` definition can be found [here](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/common-types/resource-management/v1/types.json#L9).

## How to fix the violation

Ensure the `Resource` type model has the properties `name`, `type` and `id` and they are marked as `readOnly:true`.
