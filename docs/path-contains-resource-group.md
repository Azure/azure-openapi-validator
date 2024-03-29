# PathContainsResourceGroup

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Uri-V1-02

## Output Message

The path for resource group scoped CRUD methods does not contain a resourceGroupName parameter.

## Description

Path for resource group scoped CRUD methods MUST contain a resourceGroupName parameter.

## CreatedAt

June 21, 2022

## LastModifiedAt

June 21, 2022

## How to fix the violation

Fix the path for resource action as below pattern:

```json
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType..."
```
