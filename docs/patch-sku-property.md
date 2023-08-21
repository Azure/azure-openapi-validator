# PatchSkuProperty

## Category

ARM Warning

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Patch-V1-09

## Output Message

The patch operation body parameter schema should contain property 'sku' if the service supports updation of the property.

## Description

RP should consider implementing Patch for the 'SKU' envelope property if it's defined in the resource model. You may ignore this violation if your service does not allow updation of the Sku property once it is set. In such a case the property must be marked with x-ms-mutability [create, read]

## CreatedAt

July 07, 2022

## LastModifiedAt

July 07, 2022

## How to fix the violation

Add the 'sku' to the patch request body schema.
