# TrackedResourcePatchOperation

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Patch-V1-03

## Output Message

Tracked resource '{0}' must have patch operation that at least supports the update of tags.

## Description

Verifies if a tracked resource has a corresponding PATCH operation.
What's a tracked resource? A Tracked Resource is an ARM Resource with "location" as a required property.

## Why the rule is important

Per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md), each tracked resource must have a PATCH operation supporting at least the update of tags.

## How to fix the violation

Add a PATCH operation that allows at least the update of tags for the tracked resource - if the operation does not exist for the service, this fix requires a service side change.
If the resource pointed by the rule is not a tracked resource, this warning may be a false positive, please clarify this with your PR reviewer.

## Impact on generated code

Generated SDK code will expose the corresponding PATCH operation only if it's present in the specification. If PATCH operation only supports updating tags, then you will potentially have two operations in the SDK: "Update" & "CreateOrUpdate", the first updates only tags while the second allows updating a bigger set of properties, which is not the best customer experience. Please strongly consider adding all mutable properties to the "Update" operation.

## Examples

N/A
