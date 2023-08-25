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
    "get": {
    },
  }
}
```

For the above Nested call to be valid add the Parent path definition provided in the following snippet:

```json
"paths": {
//Parent Resource Get Call definition
  "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ProviderNamespace/parentResourceType/{parentInstance}": {
    "get": {
    },
  },
//Nested Resource Type Get Call definition
  "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ProviderNamespace/parentResourceType/{parentInstance}/nestedResourceType": {
    "get": {
    },
  }
}
```

Few more patterns 

```json
"paths": {
//Following Nested Resource Type Path is invalid because Resource Group Name is missing
//Parent Resource Get Call definition
  "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ProviderNamespace/parentResourceType/{parentInstance}": {
    "get": {
    },
  },
//Nested Resource Type Get Call definition
  "/subscriptions/{subscriptionId}/providers/Microsoft.ProviderNamespace/resourceType/{instance}": {
    "get": {
    },
  },
//Add missing Resource Group as mentioned below after {subscriptionId}/ on Nested Resource Type Path
//Parent Resource GetCall definition
  "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ProviderNamespace/parentResourceType/{parentInstance}": {
    "get": {
    },
  },
//Nested Resource Type Get Call definition  
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ProviderNamespace/resourceType/{instance}": {
    "get": {
    },
  },

//Following Nested Resource Type Path is invalid because SubscriptionId is missing
//Parent Resource Get Call definition
  "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ProviderNamespace/parentResourceType/{parentInstance}": {
    "get": {
    },
  },
//Nested Resource Type Get Call definition
  "/subscriptions/resourceGroups/{resourceGroupName}/providers/Microsoft.ProviderNamespace/resourceType/{instance}": {
    "get": {
    },
  },
//Add missing SubscriptionId as mentioned below after {subscriptions}/ on Nested Resource Type Path
//Parent Resource Get Call definition
  "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ProviderNamespace/parentResourceType/{parentInstance}": {
    "get": {
    },
  },
//Nested Resource Type Get Call definition
  "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ProviderNamespace/resourceType/{instance}": {
    "get": {
    },
  }
}
```
