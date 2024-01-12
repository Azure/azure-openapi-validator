# TrackedResourceSchemaTags

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Put-V1-07

## Description

Every tracked resource **must** support tags as an **optional** property. The specified tracked resource either does not have 'tags' as a property or has 'tags' marked as required.

## How to fix the violation

Ensure that, for a model that represents a tracked resource, it MUST have tags as a top level property and it is an optional property.
