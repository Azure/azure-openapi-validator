# ReservedResourceNamesModelAsEnum

## Category

ARM Error

## Applies to

ARM OpenAPI (swagger) specs

## Related ARM Guideline Code

- RPC-ConstrainedCollections-V1-04

## Description

Service-defined (reserved) resource names must be represented as an `enum` type with `modelAsString` set to `true`, not
as a static string in the path. This is to allow for expansion of the resource collection to include more service
defined instances in future if necessary. Changing the representation of the path in swagger to an enum does not require
you to change the implementation of the API in the service. Adhering to this best practice helps with forward
compatibility and avoids potential breaking changes in future revisions of the API.

## How to fix the violation

Instead of using a reserved name at the end of the path, use a path parameter. E.g.,

```diff
- "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Bakery/breads/defaultBread"
+ "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Bakery/breads/{breadName}"
```

```json
"BreadName": {
  "name": "breadName",
  "type": "string",
  "description": "The type of bread.",
  "enum": [
    "baguette",
    "brioche",
    "sourdough",
    "rye"
  ],
  "x-ms-enum": {
    "name": "breadName",
    "modelAsString": true
  }
}
```
