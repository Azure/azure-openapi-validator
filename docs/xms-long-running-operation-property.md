# XmsLongRunningOperationProperty

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Async-V1-15

## Output Message

If an operation's (PUT/POST/PATCH/DELETE) responses have `Location` or `Azure-AsyncOperation` headers then it MUST have the property `x-ms-long-running-operation` set to `true`.

## Description

If an operation's (PUT/POST/PATCH/DELETE) responses have `Location` or `Azure-AsyncOperation` headers then it MUST have the property `x-ms-long-running-operation` set to `true`.

## How to fix the violation

You can do either of the following:
- If the operation is intended to be a long running operation, set the property `x-ms-long-running-operation` to `true`.
- If the operation is not intended to be a long running operation, `x-ms-long-running-operation` MUST be set to `false` and the `Location` and `Azure-AsyncOperation` headers MUST not be specified in the response.

### Valid Examples

If you want `headers` to be included in the `responses` that is considered as ASYNC call, then you must set `x-ms-long-running-operation : true` as below example

```json
...
// responses with headers
"responses": {
    "2XX": {
      "description": "Async call",
      "headers": {
        "Azure-AsyncOperation": {
          "type": "string",
        },
        "Location": {
          "type": "string",
        },
      },
    },
  },
// set this property as true
"x-ms-long-running-operation": true
...
```

The following would be valid for SYNC calls:

```json
...
// responses with No headers
"responses": {
    "2xx": {
      "description": "sync call",
      // No headers
    }
  },
"x-ms-long-running-operation": false
...
```
