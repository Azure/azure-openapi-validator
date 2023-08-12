# AllowNestedIfParentExist

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Get-V1-11

## Description

When the parent resource is scoped under a resource group, the path for the list calls of its child resources must also be scoped under a resource group

## How to fix

To fix this, ensure that the LIST call for the child resource has a resource group segment.

### Invalid example

Following are the patterns for the invalid examples
GET /subscriptions/{sub1}/providers/{ProviderName}/resourceType1/{resourceTypeName}/nestedResourceType
GET /subscriptions/{sub1}/providers/{ProviderName}/nestedResourceType
GET /subscriptions/{sub1}/resourcegroups/{rgname}/providers/{ProviderName}/nestedResourceType

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
