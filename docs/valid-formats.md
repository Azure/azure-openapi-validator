# ValidFormats

## Category

SDK Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

'{0}' is not a known format.

## Description

Only valid types are allowed for properties.

## Why the rule is important

Invalid formats can cause errors during code generation or result in erroneous generated code.

## How to fix the violation

Ensure format defined for property is valid. Please refer [here](https://github.com/Azure/autorest/blob/81d4d31d06637f4f9ef042d7f2ec64cfea29892f/docs/developer/validation-rules/valid-formats.md) for allowed types in OpenAPI.
