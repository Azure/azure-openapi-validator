# NestedResourcesMustHaveListOperation

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The nested resource "{0}" does not have list operation, please add it.

## Description

Per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md), all the nested must have a list operation which returns the collection of the resource.

## CreatedAt

July 13, 2020

## LastModifiedAt

July 13, 2020

## How to fix the violation

For each nested resource, add the corresponding list operation.

For example:

```json
...
   "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyTopLevelResourceType/{name}/MySubResource": {
      "get": {
        ...
        ...
        "description": "Handles requests to list all resources in a service.",
        "operationId": "MySubResource_List",
        ...
        "responses": {
          "200": {
            "description": "Success. The response describes the list of Services in the service.",
            "schema": {
              "$ref": "#/definitions/MySubResourceList"
            }
          }
        },
...
```
