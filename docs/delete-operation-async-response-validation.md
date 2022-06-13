# DeleteOperationAsyncResponseValidation

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

DELETE async supports

## Description

An async DELETE operation response include status code 202 with 'Location' header. Must support status code 200 if operation can be completed synchronously. Must support 204 (resource doesn't exists). Operation must also add "x-ms-long-running-operation and x-ms-long-running-operation-options" to mark that it is a long running operation (in case of 202) and how it is tracked (Location header).

## CreatedAt

November 12, 2020

## LastModifiedAt

November 12, 2020

## Why this rule is important

RPaaS only supports 202 for async DELETE operations. This is enforced at runtime via swagger validation.

## How to fix the violation

Add the following for async DELETE operations.

The following would be valid:

```json
...
  "responses": {
      "202": {
        "description": "Delete operation accepted",
      },
      "200": {
        "description": "Delete operation succeeded"
      },
      "204": {
        "description": "Resource doesn't exist. Delete operation completed."
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
      "final-state-via": "location"
  }
...
```
