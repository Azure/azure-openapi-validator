# ReservedResourceNamesModelAsEnum

## Category

ARM Error

## Applies to

ARM OpenAPI (swagger) specs

## Related ARM Guideline Code

- RPC-ConstrainedCollections-V1-04

## Description

Service-defined (reserved) resource names must be represented as an `enum` type with `modelAsString` set to `true`, not as a static string in the path.

## How to fix the violation

Instead of using a reserved name at the end of the path, use a path parameter. E.g.,

```diff
- "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Bakery/breads/defaultBread"
+ "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Bakery/breads/{breadName}"
```
