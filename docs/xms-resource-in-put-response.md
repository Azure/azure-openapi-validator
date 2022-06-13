# XmsResourceInPutResponse

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The 200 response model for an ARM PUT operation must have x-ms-azure-resource extension set to true in its hierarchy. Operation: '{0}' Model: '{1}'.

## Description

The 200 response model for an ARM PUT operation must have x-ms-azure-resource extension set to true in its hierarchy. Operation: '{0}' Model: '{1}'.

## Why the rule is important

This will ensure that the PUT operation actually returns a resource model.Please refer [here](https://github.com/Azure/autorest/tree/main/docs/extensions.md#x-ms-azure-resource) for details on x-ms-azure-resource extension.

## How to fix the violation

Ensure that the 200 response model for an ARM PUT operation must have x-ms-azure-resource extension set to true in its hierarchy.
