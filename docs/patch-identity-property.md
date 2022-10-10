# PatchIdentityProperty

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-V2-Patch-11

## Output Message

The patch operation body parameter schema should contains property 'identity'.

## Description

RP must implement PATCH for the 'identity' envelope property if it's defined in the resource model.

## CreatedAt

July 07, 2022

## LastModifiedAt

July 07, 2022

## How to fix the violation

Add the 'identity' to the patch request body schema.
