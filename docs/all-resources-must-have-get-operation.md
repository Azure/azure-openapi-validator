# AllResourcesMustHaveGetOperation

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Get-V1-04

## Output Message

The resource "{0}" does not have get operation, please add it.

## Description

Per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md) ,all the resources ,including top-level and nested resources, must have a get operation.

## CreatedAt

July 13, 2020

## LastModifiedAt

July 13, 2020

## How to fix the violation

Since all the models that having 'x-ms-azure-resource' enabled are considered as ARM resource,
If the output resource is not exactly a ARM resource,you should remove the extension from the model.
Otherwise,for each resource which doesn't have a get operation,add the corresponding get operation.

For example:

```json
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType/{Name}/SubResource/{subName}": {
      "get": {
         ...
        "operationId": "SubResource_Get",
        "parameters": [

        ],
        "responses": {
          "200": {
            "schema": {
              "$ref": "#/definitions/SubResource"
            }
          },
```
