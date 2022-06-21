# URIForResourceAction

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The URI for resource action does not follow the valid resource pattern.

## Description

Uri for 'post' method on a resource type MUST follow valid resource naming, like '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType/{Name}/Action'.

## CreatedAt

June 21, 2022

## LastModifiedAt

June 21, 2022

## How to fix the violation

Fix the URI for resource action as follow below pattern:

```json
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType/{Name}/Action"
```
