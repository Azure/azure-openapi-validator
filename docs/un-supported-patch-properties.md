# UnSupportedPatchProperties

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Patch-V1-02

## Output Message

The patch operation body parameter schema should not contain top level "id", "name", "type", "location" as writable properties. This is because these properties are expected to be either readOnly or immutable.

## Description

Patch may not change the name, location, or type of the resource.

## CreatedAt

July 07, 2022

## LastModifiedAt

July 07, 2022

## How to fix the violation

Consider either removing the top-level properties - "id", "name" and "type", from the patch request body parameter schema, or mark them as readOnly. For the top-level "location" property (that is specified for tracked resources), consider either removing it from the request body of the Patch operation or mark it as immutable using the x-ms-mutability property and values as "create" and "read".
