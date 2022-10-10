# TrackedResourceListByResourceGroup

## Category

ARM Warning

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The tracked resource, '{0}', must have a list by resource group operation.

## Description

Verifies if a tracked resource has a corresponding ListByResourceGroup operation.
What's a tracked resource? A Tracked Resource is an ARM Resource with "location" as a required property.

## Why the rule is important

Per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md), each tracked resource must have a corresponding ListByResourceGroup operation.

## How to fix the violation

Add a corresponding ListByResourceGroup operation for the tracked resource - if the operation does not exist for the service, this fix requires a service side change. If the operation already exists and it is not named following the naming convention "ListbyResourceGroup", consider updating the operation name.
If the resource pointed by the rule is not a tracked resource or the operation that allows listing by resource group does not follow the naming convention "ListByResourceGroup", this warning may be a false positive, please clarify this with your PR reviewer.

## Impact on generated code

Generated SDK code will expose the corresponding ListByResourceGroup operation as included in the specification.

## Examples

N/A
