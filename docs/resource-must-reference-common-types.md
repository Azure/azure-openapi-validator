# ResourceMustReferenceCommonTypes

## Category

ARM Error

## Applies to

ARM OpenAPI (Swagger) specs

## Description

Validates that any resource definitions use the definitions for ProxyResource or TrackedResource already defined in the common types.

## How to fix the violation

Ensure that all resource definitions reference the ProxyResource or TrackedResource definitions in the common types.

E.g.,

```json
"allOf": [
  {
    "$ref": "../../../../../common-types/resource-management/v2/types.json#/definitions/ProxyResource"
  }
],
```
