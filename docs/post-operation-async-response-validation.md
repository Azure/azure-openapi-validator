# PostOperationAsyncResponseValidation

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Async-V1-11

## Output Message

- Only 202 is the supported response code for POST async response.
- An async POST operation must return 202.
- An async POST operation must set '"x-ms-long-running-operation" : true''.
- An async POST operation must set long running operation options 'x-ms-long-running-operation-options'.
- An async POST operation is tracked via Azure-AsyncOperation header. Set 'final-state-via' property to 'location' on 'x-ms-long-running-operation-options'.

## Description

An async POST operation response include status code 202 with 'Location' header. Must support status code 200 if operation can be completed synchronously. Operation must also add "x-ms-long-running-operation and x-ms-long-running-operation-options" to mark that it is a long running operation (in case of 202) and how it is tracked (Location header).

## CreatedAt

November 12, 2020

## LastModifiedAt

November 12, 2020

## Why this rule is important

202 or async POST operations. This is enforced at runtime via swagger validation.

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
