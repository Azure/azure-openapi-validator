# Changelog

## What's New (07/07/2017)

### Resolved issues/Bug fixes
-   Ensure Top level properties cannot be outside a fixed set. Linked [issue](https://github.com/Azure/autorest/issues/2305)
-   Add Message about tenant level resources to ListByResourceGroup and ListBySubcription. Linked [issue](https://github.com/Azure/autorest/issues/2389)
-	Ensuring validating items property must exist for an array type.

-	Better path reporting for R3010. Linked [issue](https://github.com/Azure/autorest/issues/2314)

-	Filtering resource models returned only by post. Linked [issue](https://github.com/Azure/autorest/issues/2316)

-	Adding rule categorizations (Merge state and document type) to validation rules. Linked [issue](https://github.com/Azure/autorest/issues/2313)

### New validation rules
-   New validation rule for Post operationIds. Documentation [link](https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#R2064)
-	Validation rule for verifying license headers. Documentation [link](https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#R2065)