# PostOperationAsyncResponseValidation

## Category

RPaaS Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-V2-ASYNC-11

## Output Message

POST async supports

## Description

An async POST operation response include status code 202 with 'Location' header. Must support status code 200 if operation can be completed synchronously. Operation must also add "x-ms-long-running-operation and x-ms-long-running-operation-options" to mark that it is a long running operation (in case of 202) and how it is tracked (Location header).

## CreatedAt

November 12, 2020

## LastModifiedAt

November 12, 2020

## Why this rule is important

RPaaS only supports 202 for async POST operations. This is enforced at runtime via swagger validation.

## How to fix the violation

Add the following for async POST operations.

The following would be valid:

```json
...
  "responses": {
      "202": {
        "description": "Operation accepted",
      },
      "200": {
        "description": "Operation completed"
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
