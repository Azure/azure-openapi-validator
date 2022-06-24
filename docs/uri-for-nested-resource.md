# URIForNestedResource

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The URI for nested resource doest not meet the valid resource pattern.

## Description

Uri for CRUD methods on a nested resource type MUST follow valid resource naming, like '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType/{Name}/NestedResourceType/{nestedResourceName}'.

## CreatedAt

June 21, 2022

## LastModifiedAt

June 21, 2022

## How to fix the violation

Fix the URI for nested resource as below pattern:

```json
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType/{ResourceName}/NestedResourceType/{nestedResourceName}": {
```
