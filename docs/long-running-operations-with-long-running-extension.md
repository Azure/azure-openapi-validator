# LongRunningOperationsWithLongRunningExtension

## Category

SDK Warning

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Async-V1-05

## Output Message

The operation '{0}' returns 202 status code, which indicates a long running operation, please enable 'x-ms-long-running-operation'.

## Description

Per [x-ms-long-running-operation](https://github.com/Azure/autorest/tree/main/docs/extensions.md#x-ms-long-running-operation) ,The operation which returns 202 status code indicates a long running operation. Every long running operation must have the x-ms-long-running-operation enabled.

## How to fix the violation

Having the "x-ms-long-running-operation" enabled.
Eg:

```json
......
......
 "put": {
        "operationId": "Foo_Create",
        "responses": {
          "202": {
            "description": ""
          },
          "x-ms-long-running-operation": true
        }
      }
......
......
```
