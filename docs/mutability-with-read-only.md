# MutabilityWithReadOnly

## Category

SDK Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

When property is modeled as "readOnly": true then x-ms-mutability extension can only have "read" value. When property is modeled as "readOnly": false then applying x-ms-mutability extension with only "read" value is not allowed. Extension contains invalid values: '{0}'

## Description

Verifies whether a model property which has a readOnly property set has the appropriate `x-ms-mutability` options. If `readonly: true`, `x-ms-mutability` must be `["read"]`. If `readonly: false`, `x-ms-mutability` can be any of the `x-ms-mutability` options. More details about this extension can be found [here](https://github.com/Azure/autorest/blob/main/docs/extensions/readme.md#x-ms-mutability).

## Why the rule is important

Not adhering to the rule violates how the x-ms-mutability extension works. A property cannot be `readonly: true` and yet allow `x-ms-mutability` as `["create", "update"]`.

## How to fix the violation

Based on the value of the `readOnly` property, assign appropriate `x-ms-mutability` options.

## Bad Example

```json
  "prop0":{
    "type": "string",
    "readOnly":true,
    "x-ms-mutability": ["read", "update"]
  }
```

## Good Example

```json
  "prop0":{
    "type": "string",
    "readOnly": false,
    "x-ms-mutability": ["read", "update"]
  }
```
