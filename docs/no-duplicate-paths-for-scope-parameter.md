# NoDuplicatePathsForScopeParameter

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Uri-V1-10

## Description

Swagger authors that use the `scope` parameter to indicate that an API is applicable to various scopes (Tenant, Management Group, Subscription, Resource Group), must not include API paths with explicitly defined scopes (e.g. subscription API path).

"subscriptions/{subscriptionId}",
"subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}",
"providers/Microsoft.Billing/billingAccounts/{billingAccountId}",
"providers/Microsoft.Billing/billingAccounts/{billingAccountId}/departments/{departmentId}",
"providers/Microsoft.Billing/billingAccounts/{billingAccountId}/enrollmentAccounts/{enrollmentAccountId}",
"providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}",
"providers/Microsoft.Billing/billingAccounts/{billingAccountId}/invoiceSections/{invoiceSectionId}",
"providers/Microsoft.Management/managementGroups/{managementGroupId}",
"providers/Microsoft.CostManagement/externalBillingAccounts/{externalBillingAccountName}",
"providers/Microsoft.CostManagement/externalSubscriptions/{externalSubscriptionName}",

For example,

```json
"paths": {

}
```

## How to fix

Add the api-version parameters, like:

```json
"parameters": {
  "$ref": "../../v3/types.json#/parameters/ApiVersionParameter"
}
```
