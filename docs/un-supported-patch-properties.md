# UnSupportedPatchProperties

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Patch-V1-02

## Output Message

The patch operation body parameter schema must not contain top level "id", "name", "type", "location" as writable properties. The operation body parameter schema must also not contain provisioningState in the properties bag as a writable property. This is because these properties are not patchable. To fix this, either remove the offending properties from the request payload of the Patch operation, or mark them as readOnly or immutable.

## Description

A Patch operation may not change the id, name, type, location, or properties.provisioningState of the resource.

## How to fix the violation

Consider either removing the top-level properties - "id", "name", "type", "properties.provisioningState", from the patch request body parameter schema, or mark them as readOnly. For the top-level "location" property (that is specified for tracked resources), consider either removing it from the request body of the Patch operation or mark it as immutable using the x-ms-mutability property and values as "create" and "read".
