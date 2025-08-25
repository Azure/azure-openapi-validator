# TenantLevelAPIsNotAllowed

## Category

ARM Warning

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Uri-V1-11

## Description

This rule checks for the tenant level APIs.

## How to fix the violation

Tenant level APIs are strongly discouraged and subscription or resource group level APIs are preferred instead. Please note that these APIs require a review from the security RBAC team during manifest check-in. For details, refer to the Manifest security review process: https://eng.ms/docs/microsoft-security/identity/auth-authz/access-control-managed-identityacmi/policy-administration-service/pas-wiki/livesite/security/manifest

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