# BillingDataInPropertiesBag

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Description

A property named `BillingData` (matched case-insensitively) must not be present in a resource's properties bag. If billing-related data is required, model it under a dedicated, appropriately named property or a separate model definition instead of placing a `BillingData` property directly in the resource properties bag.

## How to fix the violation

Remove the `BillingData` property from the resource properties bag. Represent the information using a differently named property or a dedicated model definition as appropriate.

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
