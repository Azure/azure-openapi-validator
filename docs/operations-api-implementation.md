# OperationsAPIImplementation

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

Operations API must be implemented for '{0}'.

## Description

Per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md), each RP must expose an operations API that returns information about all the operations available with the service.

## Why the rule is important

For better user experience. Users can query the service to get a list of all possible operations on a service and decide what they have to do.

## How to fix the violation

Add an operations API endpoint (if not already present) and add details regarding this endpoint in the corresponding OpenAPI document. Examples can be found for most RPs in this repo.

## Example

A typical operations path would look like
```json
"/providers/Microsoft.ResourceProviderName/operations": {
    "get": {
        "tags": [
            "Operations"
        ],
        "description": "Lists all of the available RP operations.",
        "operationId": "ListOperations",
        "parameters": [{
            "$ref": "#/parameters/apiVersionParameter"
        }],
        "responses": {
            "200": {
                "description": "OK. The request has succeeded.",
                "schema": {
                    "$ref": "#/definitions/OperationListResult"
                }
            },
            "default": {
                "description": "Resource Provider error response describing why the operation failed.",
                "schema": {
                    "$ref": "#/definitions/ErrorResponse"
                }
            }
        },
        "x-ms-pageable": {
            "nextLinkName": "nextLink"
        }
    }
}
```
A typical `OperationsList` and `Operation` model would look like
```json

"Operation": {
  "description": "REST API operation",
  "type": "object",
  "properties": {
    "name": {
      "description": "Operation name: {provider}/{resource}/{operation}",
      "type": "string"
    },
    "display": {
      "description": "The object that represents the operation.",
      "properties": {
        "provider": {
          "description": "Service provider: Microsoft.ResourceProvider",
          "type": "string"
        },
        "resource": {
          "description": "Resource on which the operation is performed: Profile, endpoint, etc.",
          "type": "string"
        },
        "operation": {
          "description": "Operation type: Read, write, delete, etc.",
          "type": "string"
        }
      }
    }
  }
},
"OperationListResult": {
  "description": "Result of the request to list Resource Provider operations. It contains a list of operations and a URL link to get the next set of results.",
  "properties": {
    "value": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Operation"
      },
      "description": "List of Resource Provider operations supported by the Resource Provider resource provider."
    },
    "nextLink": {
      "type": "string",
      "description": "URL to get the next set of operation list results if there are any."
    }
  }
},
```
