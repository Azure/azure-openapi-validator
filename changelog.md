# Changelog

## What's New (03/19/2018)

### Resolved issues/Bug fixes
- Fixed Typo in AllowedTopLevelProperties list in BodyTopLevelProperties rule.Refer [Issue #144](https://github.com/Azure/azure-openapi-validator/issues/144) and [PR #146](https://github.com/Azure/azure-openapi-validator/pull/146) for further details. 

### New validation rules
- XmsParameterLocation - Any global parameter (other than subscription Id and API Version) must have the "x-ms-parameter-location" extension applied. If the parameter should be a client parameter, then the extension must have the value "client". Else, it must have the have "method". Refer [Issue #84](https://github.com/Azure/azure-openapi-validator/issues/84) and [PR #2649](https://github.com/Azure/azure-rest-api-specs/pull/2649) for further details.


## What's New (11/28/2017)

### Resolved issues/Bug fixes
-	Fixed camel case suggestions, lowercasing the first character.
-	Both dotnet and typescript sections can be debugged again.
-   Fixed errors in the application of `NotNodeName` rule.

## What's New (11/08/2017)

### Resolved issues/Bug fixes
-	Correcting path retruned by PostOperationIdContainsUrlVerb rule
-	Added zones as allowed top level properties

## What's New (09/12/2017)

### Resolved issues/Bug fixes
-	Better camelcased suggestions
-	Better handling of empty operationIds in OpenAPI specs
-	Case insensitive checks for top level resource properties
-	Better messaging for tracked resources related rules

### New validation rules
-	ArraySchemaMustHaveItems – A schema of array type must always contain an items property. without it, AutoRest will fail to generate an SDK. Documentation [link](https://github.com/Azure/azure-rest-api-specs/blob/8ac36944d0ab7f6d07daf077a99bdae873d5e3f6/documentation/openapi-authoring-automated-guidelines.md#R2009) Category: SDK Error
-	LicenseHeaderMustNotBeSpecified - x-ms-code-generation-settings must not have the license section specified in the OpenAPI documents since each generated SDK can have a different licensing header. This information must be provided either from the command line or the configuration file when actually generating the sdk. Documentation [link](https://github.com/Azure/azure-rest-api-specs/blob/8ac36944d0ab7f6d07daf077a99bdae873d5e3f6/documentation/openapi-authoring-automated-guidelines.md#R2065) Category : SDK Warning
-	PostOperationIdContainsUrlVerb - A POST operation's operationId should contain the verb indicated at the end of the corresponding url. Documentation [link](https://github.com/Azure/azure-rest-api-specs/blob/8ac36944d0ab7f6d07daf077a99bdae873d5e3f6/documentation/openapi-authoring-automated-guidelines.md#R2066) Category : SDK Warning


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