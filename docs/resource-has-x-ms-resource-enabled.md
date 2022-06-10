# ResourceHasXMsResourceEnabled

## Category

SDK Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

A 'Resource' definition must have x-ms-azure-resource extension enabled and set to true.

## Description

A 'Resource' definition must have x-ms-azure-resource extension enabled and set to true. This will indicate that the model is an Azure resource.

## Why the rule is important

This will ensure that the 'Resource' definition is designed correctly in code generation.Please refer [here](https://github.com/Azure/autorest/tree/main/docs/extensions.md#x-ms-azure-resource) for further details.

## How to fix the violation

Ensure that the 'Resource' definition has x-ms-azure-resource extension enabled and set to true.
