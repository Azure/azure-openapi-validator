# CreateOperationAsyncResponseValidation

## Category

RPaaS Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-V2-ASYNC-1

## Output Message

Only 201 is the supported response code for PUT async response

## Description

An async PUT operation response include status code 201 with 'Azure-async-operation' header. Must also support status code 200, for simple updates that can be completed synchronously (ex: tags). Operation must also add "x-ms-long-running-operation and x-ms-long-running-operation-options" to mark that it is a long running operation (in case of 201) and how it is tracked (Azure-async-operation header).

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
    "x-ms-long-running-operation": true,
    "x-ms-long-running-operation-options": {
      "final-state-via": "azure-async-operation"
  }
...
```
