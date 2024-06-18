# TagsAreNotAllowedForProxyResources

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Put-V1-30

## Description

Validates that `tags` is not defined in the properties bag, but rather as a top-level property,
`tags` should not be specified in the properties bag for proxy resources. Consider using a Tracked resource instead.

## How to fix the violation

Ensure that any `tags` definitions are as top-level properties, not in the properties bag.

### Valid/Good Example

```json
"definitions": {
  "Resource": {
    "type": "object",
    "properties": {
    "type": "object",
      // tope level properties
      "tags": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
          "params": {
            "type": "boolean",
          },
        }
      },
      "location": {
        "type": "string"
      }
    }
  },
}
```

### Invalid/Bad Example

```json
"definitions": {
  "Resource": {
    "type": "string",
      "properties": {
      "type": "object",
        "properties": {
        "type": "object",
          // Nested Properties
          "tags": {
          "type": "object",
          "additionalProperties": {
            "type": "object",
              "params": {
                "type": "boolean",
            },
          }
        },
      },
    }
  }
}
```