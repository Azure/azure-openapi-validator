# SuggestScopeParameter

## Category

ARM Warning

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- N/a

## Description

OpenAPI authors can use the `scope` path parameter to indicate that an API is applicable to various scopes (Tenant,
Management Group, Subscription, Resource Group, etc.) rather than explicitly defining each scope in the spec.

## How to fix

Remove all explicitly-scoped paths that only vary in scope and create a path with the `scope` parameter.

Example of explicitly-scoped paths that only vary in scope:

2. Explicitly-scoped path (by subscription)
   **`/subscriptions/{subscriptionId}`**`/providers/Microsoft.Bakery/breads`

3. Explicitly-scoped path (by resource group):
   **`/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}`**`/providers/Microsoft.Bakery/breads`

These two paths can be replaced with a single path that uses the `scope` parameter:

1. Path with scope parameter:
   **`/{scope}`**`/providers/Microsoft.Bakery/breads`
