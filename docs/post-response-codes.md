# PostResponseCodes

## Category

ARM Error

## Applies to

ARM OpenAPI (swagger) specs

## Related ARM Guideline Code

- RPC-Async-V1-11

## Output Message

Synchronous POST operations must have responses with either 200, default OR 204, default return codes. They also must not have other response codes.
Long-running POST operations must have responses with 202, default return codes and should also have a 200 return code only if the final response is intended to have a schema, if not the 200 return code must not be specified. They also must not have other response codes.

## Description

Synchronous POST must have either 200 or 204 return codes.
LRO POST must have 202 return code. They also should have a 200 return code to indicate the schema for the final response if the final response is intended to have a schema. If the final response schema is empty the 200 return code must not be specified. They also must not have other response codes.

## How to fix the violation

For Synchronous POST operations add responses with either 200,default or 204, default return codes and make sure they don't have other response codes.

For Long-running POST operations 
1. Add responses with 202, default return codes and add 200 response code only if the final response is intended to have a schema. Also, they shouldn't have other response codes specified.
2. Make sure to define "x-ms-long-running-operation".

### Example

The following would be a valid SYNC POST:

```json
...
  "responses": {
    "200": {
      "description": "Operation completed",
      "schema": {
        "$ref": "#/definitions/FooResource"
      }
    },
    "default": {
      "description": "Error response describing why the operation failed.",
      "schema": {
        "$ref": "#/definitions/ErrorResponse"
      }
    }
  }
...
```

```json
...
  "responses": {
    "204": {
      "description": "No Content",
      "schema": {
        "$ref": "#/definitions/FooResource"
      }
    },
    "default": {
      "description": "Error response describing why the operation failed.",
      "schema": {
        "$ref": "#/definitions/ErrorResponse"
      }
    }
  }
...
```

The following would be a valid ASYNC POST:

```json
...
  "responses": {
    "202": {
      "description": "Operation accepted",
      "schema": {
        "$ref": "#/definitions/FooResource"
      }
    },
    "200": {
      "description": "Operation completed",
      "schema": {
        "$ref": "#/definitions/FooResource"
      }
    },
    "default": {
      "description": "Error response describing why the operation failed.",
      "schema": {
        "$ref": "#/definitions/ErrorResponse"
      }
    }
  },
  "x-ms-long-running-operation": true,
...
```

```json
...
  "responses": {
    "202": {
      "description": "Operation accepted",
      "schema": {
        "$ref": "#/definitions/FooResource"
      }
    },
    "default": {
      "description": "Error response describing why the operation failed.",
      "schema": {
        "$ref": "#/definitions/ErrorResponse"
      }
    }
  },
  "x-ms-long-running-operation": true,
...
```
