# UnSupportedPatchProperties

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Patch-V1-02

## Output Message

The patch operation body parameter schema should not contains property {propertyName}.

## Description

Patch may not change the name, location, or type of the resource.

## CreatedAt

July 07, 2022

## LastModifiedAt

July 07, 2022

## How to fix the violation

Considering removing the name, location, or type in the patch request body.
