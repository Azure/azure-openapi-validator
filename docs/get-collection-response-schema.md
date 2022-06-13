# GetCollectionResponseSchema

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The response model in the GET collection operation "{0}" does not match with the response model in the individual GET operation "{1}".

## Description

Per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md#get-resource), for all resources (top-level and nested), collection GETs should have a response definition with a property "value" containing an array of the "resource" schema.The definition returned in the collection "value" array should be the same as the response body for the individual GET.

## CreatedAt

July 13, 2020

## LastModifiedAt

July 13, 2020

## How to fix the violation

Make sure the collection GETs return an array and its items schema the same as the response schema in corresponding individual GET.

The following response is a good example:

```json
...

 "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType/{Name}": {
      "get": {
        ...
        ...
        "responses": {
          "200": {
            "description": "Success. The response describes the corresponding Service.",
            "schema": {
              "$ref": "#/definitions/MyResourceSchema"
            }
          }

...
...

 "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType": {
      "get": {
        .....
        "responses": {
          "200": {
            "description": "Success. The response describes the list of Services in the resource group.",
            "schema": {
              "$ref": "#/definitions/MyResourceList"
            }
          },
...
...
"MyResourceList":{
   "type": "object", 
     "properties": { 
       "value": { 
           "type": "array", 
           "items": { 
               "$ref": "#/definitions/MyResourceSchema" 
           } 
       },
...
```
