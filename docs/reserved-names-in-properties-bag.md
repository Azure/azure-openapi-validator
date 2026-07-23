# ReservedNamesInPropertiesBag

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Description

Certain property names are reserved and must not be defined in a resource's properties bag. Reserved names are matched case-insensitively and are maintained as an extensible list in the rule (currently `BillingData`); more names may be added over time. If information represented by a reserved name is required, model it under a dedicated, appropriately named property or a separate model definition instead of placing a reserved property directly in the resource properties bag.

## How to fix the violation

Remove the reserved property from the resource properties bag. Represent the information using a differently named property or a dedicated model definition as appropriate.

### Valid/Good Example

```json
"Resource": {
  "properties": {
    "properties": {
      "provisioningState": {
        "type": "string"
      }
    }
  }
}
```

### Invalid/Bad Example

```json
"Resource": {
  "properties": {
    "properties": {
      "billingData": {
        "type": "string"
      }
    }
  }
}
```

```json
"Resource": {
  "properties": {
    "properties": {
      "billingData": {
        "$ref": "#/definitions/BillingData"
      }
    }
  }
}
```
