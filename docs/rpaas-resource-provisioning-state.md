# RPaasResourceProvisioningState

## Category

RPaaS Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

[RPaaS] The resource {0} is defined without 'provisioningState' in properties bag, consider adding the provisioningState for it.

## Description

Verifies if a Azure resource has a corresponding 'provisioningState' property. If the 'provisioningState' is not defining explicitly , the client will drop the state when the service does return it.

## CreatedAt

January 15, 2021

## LastModifiedAt

January 15, 2021

## Why this rule is important

Per [Azure RPC](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/Addendum.md#provisioningstate-property), all Azure resources must support "provisioningState" property.

## How to fix the violation

Add the 'provisioningState' for every Azure resource.

The following would be valid:

```json
...
resourceDefinition": {
  "description": "resource definition",
  "type": "object",
  "properties": {
    "properties": {
    "type": "object",
      "properties" :{
        "provisioningState": {
          "type": "string",
          "readOnly": true
        }
        ...
      }
    }
  }
}
...
```
