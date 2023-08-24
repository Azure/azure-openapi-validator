# MissingSegmentsInNestedResourceListOperation

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Get-V1-11

## Description

A nested resource type's List operation must include all the parent segments in its api path.

## How to fix

To fix this, ensure that the list operation's api path for the nested resource includes all the parent segments.

### Examples

The below path is invalid because there is no Parent path definition for the Nested path defined.

```json
"paths": {
// No Parent Resource Get Call defined
"undefined parent path"

//Nested Resource Type Get Call definition
  "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ProviderNamespace/parentResourceType/{parentInstance}/nestedResourceType": {
    "get/put/delete/post": {
    },
  }
}
```

For the above Nested call to be valid add the Parent path definition provided in the following snippet:

```json
"paths": {
//Parent Resource Get Call definition
  "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ProviderNamespace/parentResourceType/{parentInstance}": {
    "get/put/delete/post": {
    },
  },
//Nested Resource Type Get Call definition
  "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ProviderNamespace/parentResourceType/{parentInstance}/nestedResourceType": {
    "get/put/delete/post": {
    },
  }
}
```

Few more patterns 

```json
"paths": {
//Following is invalid because Resource Group Name is missing
  "/subscriptions/{subscriptionId}/providers/Microsoft.ProviderNamespace/resourceType/{instance}": {
    "get/put/delete/post": {
    },
  },
//Add missing Resource Group as mentioned below after {subscriptionId}/
  "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ProviderNamespace/resourceType/{instance}": {
    "get/put/delete/post": {
    },
  },
//Following is invalid because SubscriptionId is missing
  "/subscriptions/resourceGroups/{resourceGroupName}/providers/Microsoft.ProviderNamespace/resourceType/{instance}": {
    "get/put/delete/post": {
    },
  },
//Add missing SubscriptionId as mentioned below after {subscriptions}/
  "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ProviderNamespace/resourceType/{instance}": {
    "get/put/delete/post": {
    },
  }
}
```
