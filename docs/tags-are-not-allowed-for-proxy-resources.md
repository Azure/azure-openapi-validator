# TagsAreNotAllowedForProxyResources

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Put-V1-30

## Description

`tags` should not be specified in the properties bag for proxy resources. Consider using a Tracked resource instead.

## How to fix the violation

Either remove the 'tags' property from the properties bag or consider using a tracked resource.

### Valid/Good Example

```json
"definitions": {
  "Resource": {
    "type": "object",
    "properties": {
    "type": "object",
      // top level properties
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