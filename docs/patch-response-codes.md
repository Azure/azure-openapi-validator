# PatchResponseCodes

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Patch-V1-06

## Output Message

Synchronous PATCH operations must have `200` and `default` return codes. They also must not have other response codes.
LRO PATCH operations must have `200`, `202`, and `default` return codes. They also must not have other response codes.

## Description

Synchronous PATCH must have 200 return code and LRO PATCH must have 200 and 202 return codes.

## How to fix the violation

For a synchronous PATCH add 200 and default return codes and make sure they don't have other response codes.
For LRO PATCH add 200, 202 and default return codes and make sure they don't have other response codes.

### Example

The following would be a valid SYNC PATCH:

```json
...
patch {
  "responses": {
    "200": {
      "description": "Operation completed",
      "schema": {
        "$ref": "#/definitions/FooResource",
      },
    },
    "default": {
      "description": "Error response describing why the operation failed.",
      "schema": {
        "$ref": "#/definitions/ErrorResponse"
      }
    }
  }
}  
...
```

The following would be a valid ASYNC PATCH:

```json
...
patch{
  "responses": {
      "202": {
        "description": "Operation accepted",
      },
      "200": {
        "description": "Operation completed",
        "schema": {
          "$ref": "#/definitions/FooResource",
        },
      },
      "default": {
        "description": "Error response describing why the operation failed.",
        "schema": {
          "$ref": "#/definitions/ErrorResponse"
        }
      }
    },
  "x-ms-long-running-operation": true,
}
...
```