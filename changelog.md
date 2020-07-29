# Changelog

## What's New (07/29/2020)

### Bug fix

- DefaultErrorResponseSchema - throw exception when the examples of operations contain $ref 

## What's New (07/27/2020)

### Changed Rule

- DescriptiveDescriptionRequired rule -  change ruleId to `R4020` 
- DescriptionAndTitleMissing rule -  change ruleId to `R4021` 
- OperationDescriptionOrSummaryRequired rule -  change ruleId to `R4022` 
- EnumMustHaveType rule - fix false positive when `enum` is a property.
- EnumMustNotHaveEmptyValue - fix false positive when `enum` is a property.
- EnumUniqueValue - fix false positive when `enum` is a property.
- IntegerTypeMustHaveFormat - fix false positive when `enum` is in `x-ms-examples`.
- UniqueXmsEnumName - fix false positive when `enum` is in `x-ms-examples`.
- OperationsAPIImplementation - fix false positive when exists multiple providers in path. 

## What's New (05/28/2020)

### New validation Rule

- RequiredSystemDataInNewApiVersion rule - the rule ensure the responses of GET, PUT and PATCH in new API versions contain the systemData object.
- RequiredDefaultResponse rule - the rule ensure every operation have a default error response implementation.
- DeleteOperationResponses rule - the rule ensure all DELETE methods have responses code implementation: 200, 204.   
- XmsPageableMustHaveCorrespondingResponse rule - the rule ensure the corresponding nextlink property has been defined in the response schema when specifying a x-ms-pagable/nextLinkName.
- IntegerTypeMustHaveFormat rule -  the rule ensure the type:integer have a required format.

### Changed Rule

- ValidFormats rule -  format:`time` is allowed. 
- LongRunningOperationsWithLongRunningExtension rule - apply to data-plane.

## What's New (05/20/2020)

### Changed Rule

- XmsEnumNameUnique rule -  the rule should passed if the two enums are defined with same entries.

## What's New (04/26/2020)

### New validation rules

- XmsEnumNameUnique rule - The rule will check if every x-ms-enum name unique.
- XmsCodeGenerationSettingDeprecated rule: The rule ensure x-ms-code-generation-settings extension should not be used.
- DefaultErrorResponseSchema rule - The rule will check if default error response is corresponding to the ARM specification.
- AvoidEmptyResponseSchema - The rule ensure the response schema is not empty.

### bug fix

- PathResourceTypeNameCamelCase: Typo & fix regex bug.

## What's New (03/27/2020)

### Changed Rule

- OperationIdRequired rule - change severity to error.
- EnumUniqueValue rule: change category to SDKViolation , severity to error.
- EnumMustHaveType rule: change category to SDKViolation , severity to error.
- EnumMustNotHaveEmptyValue: change category to SDKViolation , severity to error.
- PathResourceProviderNamePascalCase: change severity to error.
- PathResourceTypeNameCamelCase: change severity to error.

## What's New (02/18/2020)

### New validation rules

- OperationIdRequired rule - The rule will check if every operation have a unique operationId.
- EnumUniqueValue rule: check Enum values whether case-insensitive unique
- EnumMustHaveType rule: check Enum values must define its type
- EnumMustNotHaveEmptyValue: check Enum values must not have empty string.
- PathResourceProviderNamePascalCase: resource provider naming in path follow pascal case
- PathResourceTypeNameCamelCase: resource type naming in path follow camel case
- PathResourceProviderMatchNamespace: check the last resource provider in path matches namespace

### Changed Rule

- Changed the linter rule BodyTopLevelProperties -- Added systemdata as allowed top level properties
- Changed the linter rule PatchBodyParametersSchema -- Allowed required property to be discriminator
- Remove linter rule UniqueResourcePaths R2059: reason is external resource provider in path is valid.

## What's New (01/07/2020)

### bug fix

- when x-ms-path contains OData, it will fail the SwaggerParser.Parse. fix this bug, and add a test to it.

## What's New (10/05/2018)

### New validation rules

- LongRunningOperationsOptionsValidator rule - The rule will check if a post LRO operation has "x-ms-long-running-operation-options" extension enabled. Refer [Issue #172](https://github.com/Azure/azure-openapi-validator/issues/172), [PR #179](https://github.com/Azure/azure-openapi-validator/pull/179) and [PR #4039](https://github.com/Azure/azure-rest-api-specs/pull/4039) for further details.

## What's New (05/09/2018)

### New validation rules

- PageableOperation rule - The rule will check if a get operation returns a schema (with 3 or less properties) with an array property. If it is so, the linter will suggest the operation might be pageable. Refer [PR #161](https://github.com/Azure/azure-openapi-validator/pull/161) for further details.

## What's New (05/02/2018)

### Changed Category

- Removed the Category **_RPCViolation_** and renamed it to **_ARMViolation_** in both dotnet and typescript linters.

## What's New (04/26/2018)

### Changed Rule

- Changed the linter rule XmsExamplesRequired -- it now has a Category of `Documentation` and an id of `D5001`. Refer [Issue #189](https://github.com/Azure/azure_sdk_ci_tools/issues/189) for further details.

## What's New (03/14/2018)

### Resolved issues/Bug fixes

- Fixed Typo in AllowedTopLevelProperties list in BodyTopLevelProperties rule.Refer [Issue #144](https://github.com/Azure/azure-openapi-validator/issues/144) and [PR #146](https://github.com/Azure/azure-openapi-validator/pull/146) for further details.

### New validation rules

- XmsParameterLocation - Any global parameter (other than subscription Id and API Version) must have the "x-ms-parameter-location" extension applied. If the parameter should be a client parameter, then the extension must have the value "client". Else, it must have the have "method". Refer [Issue #84](https://github.com/Azure/azure-openapi-validator/issues/84) and [PR #2649](https://github.com/Azure/azure-rest-api-specs/pull/2649) for further details.

## What's New (11/28/2017)

### Resolved issues/Bug fixes

- Fixed camel case suggestions, lowercasing the first character.
- Both dotnet and typescript sections can be debugged again.
- Fixed errors in the application of `NotNodeName` rule.

## What's New (11/08/2017)

### Resolved issues/Bug fixes

- Correcting path returned by PostOperationIdContainsUrlVerb rule
- Added zones as allowed top level properties

## What's New (09/12/2017)

### Resolved issues/Bug fixes

- Better camelcased suggestions
- Better handling of empty operationIds in OpenAPI specs
- Case insensitive checks for top level resource properties
- Better messaging for tracked resources related rules

### New validation rules

- ArraySchemaMustHaveItems – A schema of array type must always contain an items property. without it, AutoRest will fail to generate an SDK. Documentation [link](https://github.com/Azure/azure-rest-api-specs/blob/8ac36944d0ab7f6d07daf077a99bdae873d5e3f6/documentation/openapi-authoring-automated-guidelines.md#R2009) Category: SDK Error
- LicenseHeaderMustNotBeSpecified - x-ms-code-generation-settings must not have the license section specified in the OpenAPI documents since each generated SDK can have a different licensing header. This information must be provided either from the command line or the configuration file when actually generating the sdk. Documentation [link](https://github.com/Azure/azure-rest-api-specs/blob/8ac36944d0ab7f6d07daf077a99bdae873d5e3f6/documentation/openapi-authoring-automated-guidelines.md#R2065) Category : SDK Warning
- PostOperationIdContainsUrlVerb - A POST operation's operationId should contain the verb indicated at the end of the corresponding url. Documentation [link](https://github.com/Azure/azure-rest-api-specs/blob/8ac36944d0ab7f6d07daf077a99bdae873d5e3f6/documentation/openapi-authoring-automated-guidelines.md#R2066) Category : SDK Warning

## What's New (07/07/2017)

### Resolved issues/Bug fixes

- Ensure Top level properties cannot be outside a fixed set. Linked [issue](https://github.com/Azure/autorest/issues/2305)
- Add Message about tenant level resources to ListByResourceGroup and ListBySubscription. Linked [issue](https://github.com/Azure/autorest/issues/2389)
- Ensuring validating items property must exist for an array type.

- Better path reporting for R3010. Linked [issue](https://github.com/Azure/autorest/issues/2314)

- Filtering resource models returned only by post. Linked [issue](https://github.com/Azure/autorest/issues/2316)

- Adding rule categorizations (Merge state and document type) to validation rules. Linked [issue](https://github.com/Azure/autorest/issues/2313)

### New validation rules

- New validation rule for Post operationIds. Documentation [link](https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#R2064)
- Validation rule for verifying license headers. Documentation [link](https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#R2065)
