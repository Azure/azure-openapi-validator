# NoDuplicatePathsForScopeParameter

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Uri-V1-10

## Description

Swagger authors that use the `scope` path parameter to indicate that an API is applicable to various scopes (Tenant,
Management Group, Subscription, Resource Group, etc.), must not include API paths with explicitly defined scopes (e.g. a
`subscription` path parameter).

## How to fix

Either remove the path with the `scope` parameter, or remove all explicitly-scoped paths that duplicate the path with
the `scope` parameter.

Example of duplicate paths:

1. Path with scope parameter:
   **`/{scope}`**`/providers/Microsoft.Bakery/breads`

2. Explicitly-scoped path (by subscription)
   **`/subscriptions/{subscriptionId}`**`/providers/Microsoft.Bakery/breads`

3. Explicitly-scoped path (by resource group):
   **`/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}`**`/providers/Microsoft.Bakery/breads`

Either path 1 must be removed or both paths 2 and 3 must be removed.
