# PatchSkuProperty

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-V2-Patch-9

## Output Message

The patch operation body parameter schema should contains property 'sku'.

## Description

RP must implement PATCH for the 'SKU' envelope property if it's defined in the resource model.

## CreatedAt

July 07, 2022

## LastModifiedAt

July 07, 2022

## How to fix the violation

Add the 'sku' to the patch request body schema.
