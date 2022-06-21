# URIContainsResourceGroup

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The URI for resource group scoped CRUD methods does not contain a resourceGroupName parameter.

## Description

Uri for resource group scoped CRUD methods MUST contain a resourceGroupName parameter.

## CreatedAt

June 21, 2022

## LastModifiedAt

June 21, 2022

## How to fix the violation

Fix the URI for resource action as below pattern:

```json
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType..."
```
