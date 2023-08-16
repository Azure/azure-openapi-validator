# PatchIdentityProperty

## Category

ARM Warning

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Patch-V1-11

## Output Message

The patch operation body parameter schema should contain property 'identity' if the service allows it to be updated.

## Description

RP should consider implementing Patch for the 'identity' envelope property if it's defined in the resource model. You may ignore this violation if your service does not allow updation of the identity property once it is set. In such a case the property must be marked with x-ms-mutability [create, read]

## CreatedAt

July 07, 2022

## LastModifiedAt

July 07, 2022

## How to fix the violation

Add the 'identity' to the patch request body schema.
