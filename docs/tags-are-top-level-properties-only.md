# TagsAreTopLevelPropertiesOnly

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Put-V1-30

## Description

Validates that `tags` is not defined in the properties bag, but rather as a top-level property.

## How to fix the violation

Ensure that any `tags` definitions are as top-level properties, not in the properties bag.

### Valid/Good Example

```json
"definitions": {
  "tags": {
    "type": "object",
    "additionalProperties": {
      "type": "object",
      "params": {
        "type": "boolean",
      },
    }
  },
  "properties": {
    "type": "object",
    "name": {
      "type": "string"
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
