# SystemDataInPropertiesBag

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-SystemData-V1-01
- RPC-SystemData-V1-02

## Description

Validates that system data is not defined in the properties bag, but rather as a top-level property.

## How to fix the violation

Ensure that any system data definitions are as top-level properties, not in the properties bag.

### Valid/Good Example

```json
"Resource": {
  "properties": {
    "systemData": {
      "$ref": "../../../../../common-types/resource-management/v2/types.json#/definitions/systemData",
    }
  }
}
```

### Invalid/Bad Example

```json
"Resource": {
  "properties": {
    "properties": {
      "systemData": {
        "$ref": "../../../../../common-types/resource-management/v2/types.json#/definitions/systemData",
      }
    }
  }
}
```
