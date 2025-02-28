# LroAzureAsyncOperationHeader

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Async-V1-06

## Output Message

All long-running operations must include an `Azure-AsyncOperation` response header.

## Description

ARM relies on the async operation header to poll for the status of the long running operation. Based on this and the
final state of the operation, downstream services like ARN and ARG are notified of the current state of the operation
and the status of the resource. If you are a brownfield service that does not implement this header, you may add a
suppression using the following TSG indicating the same.
TSG link - https://github.com/Azure/autorest/blob/main/docs/generate/suppress-warnings.md.
In the description for the suppression, please provide a rough timeline by which the header will be supported by your
service. More details about this header can be found in the ARM Resource Provider Contract documentation here - https://github.com/cloud-and-ai-microsoft/resource-provider-contract/blob/master/v1.0/async-api-reference.md#azure-asyncoperation-resource-format

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
