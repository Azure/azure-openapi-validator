# PostResponseCodes

## Category

ARM Error

## Applies to

ARM OpenAPI (swagger) specs

## Related ARM Guideline Code

- RPC-Async-V1-11, RPC-Async-V1-14, RPC-POST-V1-02, RPC-POST-V1-03 

## Description

Synchronous POST operations must only use 200 with a default response when a response schema is required, or 204 with a default response when no schema is needed. No other response codes are allowed. 

Long-running POST (LRO) operations must initially return 202 with a default response and no schema. The final response must be 200 with a schema if one is required, or 204 with no schema if not. No other response codes are permitted.

## How to fix the violation

Synchronous POST operations must have one of the following combinations of responses - 200 and default ; 204 and default. They also must not have other response codes.

For Long-running POST operations:
1. Add responses with 202 and default return codes.
2. Add 200 response code if only if the final response is intended to have a schema if not add 204 response code.
3. Ensure no other response codes are specified.
4. Make sure to define "x-ms-long-running-operation".
5. 202 response for a LRO POST operation must not have a response schema specified.

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
    },
    "204": {
      "description": "No Content",
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
