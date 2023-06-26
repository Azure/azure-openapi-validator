# AllowNestedIfParentExist

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Get-V1-11

## Description

List calls for nested children under the resource group segment is allowed only if parent resource under the resource group exist.

## How to fix

Nested List call without parent call is invalid, ensure to add Parent Resource get call as below valid example or remove the Nested get call from the paths.

### Invalid example

```json
"paths": {
  "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ProviderNamespace/ParentResourceType/{parentInstance}/NestedResourceType": {
    "get": {
        //Nested Resource Type Get Call definition
    },
  }
// No Parent Resource Get Call definied
}
```

### Valid example

```json
"paths": {
  "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ProviderNamespace/ParentResourceType/{parentInstance}": {
    "get": {
      //Parent Resource Get Call definition
    },
  },
  "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ProviderNamespace/ParentResourceType/{parentInstance}/NestedResourceType": {
    "get": {
        //Nested Resource Type Get Call definition
    },
  }
}
```
