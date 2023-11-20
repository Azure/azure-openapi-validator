# TenantLevelAPIsNotAllowed

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Uri-V1-11

## Description

Tenant level APIs are strongly discouraged and subscription or resource group level APIs are preferred instead.
If you cannot model your APIs at these levels, you will need to present your design and get an exception from the PAS team.

Once the exception is granted author would need to suppress the error being flagged by following steps mentioned in https://github.com/Azure/autorest/blob/main/docs/generate/suppress-warnings.md#suppress-warnings

## How to fix the violation

The error can be fixed by one of the following ways:
1. Do not define tenant level api's for PUT operation
1. If tenant level write operations cannot be avoided, get an exception from PAS team. Please reach out to the following contacts to do a design review - SARBACRev, prasnal@microsoft.com, ARM Auth Team <armrbac@microsoft.com>. Apply a suppression for this error providing an evidence of a sign-off to the API reviewer over email


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