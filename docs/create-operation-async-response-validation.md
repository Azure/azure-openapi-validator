# CreateOperationAsyncResponseValidation

## Category

RPaaS Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Async-V1-01

## Output Message

202 is not a supported response code for PUT async response

## Description

An async PUT operation response must include status code 201 for creates. It must also support status code 200, for replace. The operation must also add "x-ms-long-running-operation" to mark that it is a long running operation.

## CreatedAt

August 10, 2020

## LastModifiedAt

August 10, 2020

## Why this rule is important

RPaaS only supports 201 for async PUT operations. This is enforced at runtime via swagger validation.

## How to fix the violation

Add the following for async PUT operations.

The following would be valid:

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
