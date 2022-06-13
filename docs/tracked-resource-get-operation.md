# TrackedResourceGetOperation

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

Tracked resource '{0}' must have a get operation.

## Description

Verifies if a tracked resource has a corresponding GET operation.
What's a tracked resource? A Tracked Resource is an ARM Resource with "location" as a required property.

## Why the rule is important

Per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md), each tracked resource must have a GET operation.

## How to fix the violation

Add a GET operation that returns the tracked resource pointed out by the rule - if the operation does not exist for the service, this fix requires a service side change.
If the resource pointed by the rule is not a tracked resource, this warning may be a false positive, please clarify this with your PR reviewer.

## Impact on generated code

Generated SDK code will expose the corresponding GET operation only if it's present in the specification.

## Examples

N/A
