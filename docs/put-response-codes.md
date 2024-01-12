# PutResponseCodes

## Category

ARM Error

## Applies to

ARM OpenAPI (swagger) specs

## Related ARM Guideline Code

- RPC-Async-V1-11, RPC-Put-V1-11

## Description

Synchronous and long-running PUT operations must have responses with 200, 201 and default return codes. They must not have any other response codes.

## How to fix

For synchronous and long-running (LRO) PUT operations, specify responses with 200 & 201 return codes.

### Good examples

The following would be valid for a synchronous PUT:

```json
...
  "responses": {
      "201": {
        "description": "Created",
        "schema": {
          "$ref": "#/definitions/MySimpleObject"
        }
      },
      "200": {
        "description": "Succeeded",
        "schema": {
          "$ref": "#/definitions/MySimpleObject"
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

The following would be valid for an asynchronous PUT:

```json
...
  "responses": {
      "201": {
        "description": "Created",
        "schema": {
          "$ref": "#/definitions/MySimpleObject"
        }
      },
      "200": {
        "description": "Succeeded",
        "schema": {
          "$ref": "#/definitions/MySimpleObject"
        }
      },
      "default": {
        "description": "Error response describing why the operation failed.",
        "schema": {
          "$ref": "#/definitions/ErrorResponse"
        }
      }
    },
    "x-ms-long-running-operation": true
...
```
