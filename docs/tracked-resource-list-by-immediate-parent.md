# TrackedResourceListByImmediateParent

## Category

ARM Warning

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The child tracked resource, '{0}' with immediate parent '{1}', must have a list by immediate parent operation.

## Description

Verifies if a tracked resource has a corresponding list by immediate parent operation.
What's a tracked resource? A Tracked Resource is an ARM Resource with "location" as a required property.

## Why the rule is important

Per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md), each tracked resource must have a corresponding "list by immediate parent" operation.

## How to fix the violation

Add an operation that allows listing the tracked resource by its immediate parent - if the operation does not exist for the service, this fix requires a service side change. If the operation already exists, please double check the name of the operation, our rule is matching the parent and child resource names to the operation names, if those don't match 100%, this warning may be a false positive, please evaluate whether the named picked is appropriate or needs update.
If the resource pointed by the rule is not a tracked resource this warning may be a false positive, please clarify this with your PR reviewer.

## Impact on generated code

Generated SDK code will expose the corresponding "list by immediate parent" operation as included in the specification.

## Examples

N/A
