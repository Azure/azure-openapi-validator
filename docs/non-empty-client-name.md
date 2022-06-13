# NonEmptyClientName

## Category

SDK Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

Empty x-ms-client-name property.

## Description

The [`x-ms-client-name`](https://github.com/Azure/autorest/tree/main/docs/extensions#x-ms-client-name) extension is used to change the name of a parameter or property in the generated code.

## Why the rule is important

This value cannot be empty, because we need to use it as the identifier for a property or model.

## How to fix the violation

Add a non-empty value for `x-ms-client-name`.

## Impact on generated code

Generated SDK code will expose the corresponding client name on property or model.

## Examples

```json
...
"x-ms-client-name": "name"
...
```
