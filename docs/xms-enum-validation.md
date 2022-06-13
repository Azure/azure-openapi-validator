# XmsEnumValidation

## Category

SDK Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

The enum types should have x-ms-enum type extension set with appropriate options. Property name: {0}.

## Description

AutoRest defines [x-ms-enum extension](https://github.com/Azure/autorest/blob/main/docs/extensions/readme.md#x-ms-enum) to provide more flexibility for enum types, please refer to the documentation.

## Why the rule is important

Including [x-ms-enum extension](https://github.com/Azure/autorest/blob/main/docs/extensions/readme.md#x-ms-enum) provides more flexibility for enum types in SDK generated code.

## How to fix the violation

Include the [x-ms-enum extension](https://github.com/Azure/autorest/blob/main/docs/extensions/readme.md#x-ms-enum) per indicated in its documentation. Consider setting "modelAsString": true, if you'd like the enum to be modeled as a string in generated SDKs, no enum validation will happen, though the values are exposed to the user for a better experience.

## Examples

Please refer to [x-ms-enum extension](https://github.com/Azure/autorest/blob/main/docs/extensions/readme.md#x-ms-enum).
