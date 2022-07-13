# PathContainsSubscriptionId

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The path for the subscriptions scoped CRUD methods do not contain the subscriptionId parameter.

## Description

Path for resource group scoped CRUD methods MUST contain a subscriptionId parameter, like '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType/{Name}'.

## CreatedAt

June 21, 2022

## LastModifiedAt

June 21, 2022

## How to fix the violation

Fix the path for resource CURD path as below pattern:

```json
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType..."
```
