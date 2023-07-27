# PostResponseCodes

## Category

ARM Error

## Applies to

ARM OpenAPI (swagger) specs

## Related ARM Guideline Code

- RPC-Async-V1-11

## Output Message

Synchronous POST operations must have one of the following combinations of responses - 200 and default ; 204 and default. They also must not have other response codes.
Long-running POST operations must have responses with 202 and default return codes. They must also have a 200 return code if only if the final response is intended to have a schema, if not the 200 return code must not be specified. They also must not have other response codes.

## Description

Synchronous POST operations must have one of the following combinations of responses - 200 and default ; 204 and default. They also must not have other response codes.
Long-running POST operations must have responses with 202 and default return codes. They must also have a 200 return code if only if the final response is intended to have a schema, if not the 200 return code must not be specified. They also must not have other response codes.

## How to fix the violation

Synchronous POST operations must have one of the following combinations of responses - 200 and default ; 204 and default. They also must not have other response codes.

For Long-running POST operations:
1. Add responses with 202 and default return codes.
2. Add 200 response code if only if the final response is intended to have a schema.
3. Ensure no other response codes are specified.
4. Make sure to define "x-ms-long-running-operation".

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
