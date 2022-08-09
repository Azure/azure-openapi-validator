# PathForResourceAction

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-V2-URI-7

## Output Message

The path for resource action does not follow the valid resource pattern.

## Description

Path for 'post' method on a resource type MUST follow valid resource naming, like '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType/{Name}/Action'.

## CreatedAt

June 21, 2022

## LastModifiedAt

June 21, 2022

## How to fix the violation

Fix the path for resource action as follow below pattern:

```json
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType/{Name}/Action"
```
