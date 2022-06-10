# TopLevelResourcesListBySubscription

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The top-level resource "{0}" does not have list by subscription operation, please add it.

## Description

Per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md), all the top-level resources must have a list by subscription operation which returns the collection of the resource.

## CreatedAt

July 13, 2020

## LastModifiedAt

July 13, 2020

## How to fix the violation

For each top-level resource, add the corresponding list operation.

For example:

```json
...
  "/subscriptions/{subscriptionId}/providers/Microsoft.MyNameSpace/MyTopLevelResourceType": {
      "get": {
        ...
        ...
        "description": "Handles requests to list all resources in a subscription.",
        "operationId": "Services_ListBySubscription",
        ...
        "responses": {
          "200": {
            "description": "Success. The response describes the list of Services in the subscription.",
            "schema": {
              "$ref": "#/definitions/MyTopLevelResourceList"
            }
          }
        },
...
```
