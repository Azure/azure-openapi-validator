# trackedExtensionResourcesAreNotAllowed

## Category

ARM Error

## Applies to

ARM OpenAPI (swagger) specs

## Related ARM Guideline Code

- RPC-Uri-V1-12

## Output Message

{0} is an extension resource and the response schema in {1} operation includes location property. Extension resources of type tracked are not allowed.

## Description

Extension resources cannot be of type tracked.

## How to fix the violation

Remove "location" property from the property bag of an extension resource.