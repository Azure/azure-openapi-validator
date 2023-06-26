# PostResponseCodes

## Category

RPaaS Error

## Applies to

ARM OpenAPI (swagger) specs

## Related ARM Guideline Code

- RPC-Async-V1-11

## Output Message

Synchronous POST operations must have responses with 200, 204 and default return codes. They also must not have other response codes.
Long-running POST operations must have responses with 200, 202 and default return codes. They also must not have other response codes.

## Description

Synchronous POST must have 200 & 204 return codes.
LRO POST must have 200 & 202 return codes with 'Location' header. LRO Operation must also add "x-ms-long-running-operation and x-ms-long-running-operation-options" to mark that it is a long running operation (in case of 202) and how it is tracked (Location header).

## How to fix the violation

For Synchronous POST operations add responses with 200, 204 and default return codes and make sure they don't have other response codes.

For Long-running POST operations 
1. Add responses with 200, 202 and default return codes and make sure they don't have other response codes 
2. Make sure to define "x-ms-long-running-operation" and "x-ms-long-running-operation-options"
3. Make sure to set "final-state-via" property to "location" in "x-ms-long-running-operation-options"

### Example

The following would be a valid SYNC POST:

```json
...
  "responses": {
      "204": {
        "description": "No Content",
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
