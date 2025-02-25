# LroAzureAsyncOperationHeader

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Async-V1-06

## Output Message

All long-running operations must include an Azure-AsyncOperation response header.

## Description

Azure-AsyncOperation header must be supported for all async long-running operations.

## CreatedAt

Oct 11, 2024

## How to fix the violation

Adding the Azure-AsyncOperation header to the response..

## Good Example

```json
  "/api/configServers": {
    "put": {
      "operationId": "ConfigServers_Update",
      "responses": {
        "202": {
          "description": "Accepted",
          "headers": {
            "Azure-AsyncOperation": {
              "type": "string",
            },
          },
        },
      },
    },
  },
```

## Bad Example

```json
  "/api/configServers": {
    "put": {
      "operationId": "ConfigServers_Update",
      "responses": {
        "202": {
          "description": "Success",
          "headers": {
            //No Azure-AsyncOperation header 
          },
        },
      },
    },
  },
```
