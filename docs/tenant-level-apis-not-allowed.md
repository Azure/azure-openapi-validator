# TenantLevelAPIsNotAllowed

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Uri-V1-11

## Description

Tenant level APIs are strongly discouraged and subscription or resource group level APIs are preferred instead. The reason for this guidance is that tenant level APIs have a really broad scope and blast radius. We permit APIs to be at this broad scope under rare conditions. Some ARM feature sets also do not cover tenant level APIs such as the use of AFEC. Additionally, if you intend to bypass the standard RBAC constructs and make the APIs unauthorized, you will need an approval from the PAS team before the open API spec can be merged.

## How to fix the violation

The error can be fixed in one of the following two ways

1. Do not define tenant level APIs
2. Address both the sub sections below

    1. Provide a justification as to why you need the APIs to have the broad tenant scope to the ARM API reviewer. To do this, please attend the ARM API review office hours to have a conversation with the ARM API reviewer. To book a slot, please visit aka.ms\armofficehoursinfo.

    2. In addition to modeling the API at the tenant scope, if you also intend to add the API to the "allowUnauthorizedActions" list in your ARM manifest, you must present your design and get an exception from the PAS team. Once you get an approval, please share the evidence of the approval by dropping a screenshot of the written approval as a comment on the PR. Please proceed by adding a suppression for the linter error indicating that the exception has been approved by the PAS team. If you do not intend to add the API to the "allowUnauthorizedActions" list in your ARM manifest, please add a suppression indicating the same.

Please use the following guidance to add a suppression - https://github.com/Azure/autorest/blob/main/docs/generate/suppress-warnings.md#suppress-warnings

To get an approval from PAS, please book their office hours slot at https://aka.ms/azurerbacofficehours . You will have to present the scenario and explain why the API needs to be unauthorized. If the service team would like to reach out over email, they can send an email to authzeng@microsoft.com 

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