# ExceptionMandateForTenantLevelApiPath

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Uri-V1-11

## Description

Tenant level API's are not allowed for a PUT operation. Exception from PAS team is mandatory for the very first implementation. 
Once the exception is granted author would need to suppress the error being flagged using https://github.com/Azure/autorest/blob/main/docs/generate/suppress-warnings.md#suppress-warnings

## How to fix the violation

The error can be fixed by one of the following ways:
1. Do not define tenant level api's for PUT operation
1. If tenant level PUT operation is mandatory, get exception from PAS team and then apply supression to the error


## Good Examples

```json
...
"/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Music/songs/{songName}" {
    "put" {}
  }
...
```

## Bad Examples
```json
...
"/providers/Microsoft.Music/songs/{songName}" {
    "put" {}
} 
...
```