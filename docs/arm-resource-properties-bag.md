# ArmResourcePropertiesBag

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Get-V1-07

## Output Message

Top level property names should not be repeated inside the properties bag for ARM resource '{0}'. Properties [{1}] conflict with ARM top level properties. Please rename these.

## Description

Per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md), top level properties should not be repeated inside the properties bag for ARM resources.

## Why the rule is important

[ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md).

## How to fix the violation

Rename or remove conflicting property. Note that this may require a change on the service side and may cause a breaking change.

## Examples

## Bad example

"id" property is repeated in the model, as "Resource" already contains "id".

```json5
"VersionedApplicationType": {
  "description": "The versioned application type resource",
  "properties": {
    "properties": {
      "id": {
        "type": "string",
        "description": "The name of the application type"
      }
    }
  },
  "allOf": [
  {
    "$ref": "#/definitions/Resource"
  }
  ]
},
"Resource":{
  "properties":{
    "id":{
      "readOnly":true,
      "type":"string",
      "description":"Fully qualified resource Id for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}"
    },
    "name":{
      "readOnly":true,
      "type":"string",
      "description":"The name of the resource"
    },
    "type":{
      "readOnly":true,
      "type":"string",
      "description":"The type of the resource. Ex- Microsoft.Compute/virtualMachines or Microsoft.Storage/storageAccounts."
    }
  },
  "x-ms-azure-resource": true
}
```
