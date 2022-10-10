# OperationsApiResponseSchema

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The response schema of operations API "{0}" does not match the ARM specification. Please standardize the schema.

## Description

The operations API should have a response body schema consistent with the [contract spec](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/proxy-api-reference.md#exposing-available-operations). The required properties such as `isDataAction`,`display.description` and `display.resource`,must be included.

## CreatedAt

July 13, 2020

## LastModifiedAt

July 13, 2020

## How to fix the violation

For each operations API ,provide a schema which consistent with the above contract.

The following response is a good example::

```json
...
 "AvailableOperations": {
    "description": "Available operations of the service",
    "type": "object",
    "properties": {
      "value": {
        "description": "Collection of available operation details",
        "uniqueItems": false,
        "type": "array",
        "items": {
          "$ref": "#/definitions/OperationDetail"
        }
      },
      "nextLink": {
        "description": "URL client should use to fetch the next page (per server side paging).\r\nIt's null for now, added for future use.",
        "type": "string"
      }
    }
  },
  "OperationDetail": {
    "description": "Operation detail payload",
    "type": "object",
    "properties": {
      "name": {
        "description": "Name of the operation",
        "type": "string"
      },
      "isDataAction": {
        "description": "Indicates whether the operation is a data action",
        "type": "boolean"
      },
      "display": {
        "$ref": "#/definitions/OperationDisplay",
        "description": "Display of the operation"
      },
      "origin": {
        "description": "Origin of the operation",
        "type": "string"
      },
      "properties": {
        "$ref": "#/definitions/OperationProperties",
        "description": "Properties of the operation"
      }
    }
  },
  "OperationDisplay": {
    "description": "Operation display payload",
    "type": "object",
    "properties": {
      "provider": {
        "description": "Resource provider of the operation",
        "type": "string"
      },
      "resource": {
        "description": "Resource of the operation",
        "type": "string"
      },
      "operation": {
        "description": "Localized friendly name for the operation",
        "type": "string"
      },
      "description": {
        "description": "Localized friendly description for the operation",
        "type": "string"
      }
    }
  }
....
```
