# EnumInsteadOfBoolean

## Category

ARM Warning

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

Booleans are not descriptive and make them hard to use. Consider using string enums with allowed set of values defined. Property: {0}.

## Description

Booleans properties are not descriptive in all cases and can make them to use, evaluate whether is makes sense to keep the property as boolean or turn it into an enum.

## Why the rule is important

Evaluate whether the property is really a boolean or not, the intent is to consider if there could be more than 2 values possible for the property in the future or not. If the answer is no, then a boolean is fine, if the answer is yes, there could be other values added in the future, making it an enum can help avoid breaking changes in the SDKs in the future.

## How to fix the violation

Create an enum property, follow autorest [x-ms-enum extension](https://github.com/Azure/autorest/blob/main/docs/extensions/readme.md#x-ms-enum) guidelines.

## Impact on generated code

Boolean property will turn into a String or an Enum (if SDK language supports it), this will depend on "modelAsString" property value as specified in [x-ms-enum extension](https://github.com/Azure/autorest/blob/main/docs/extensions/readme.md#x-ms-enum) guidelines.

## Examples

N/A
