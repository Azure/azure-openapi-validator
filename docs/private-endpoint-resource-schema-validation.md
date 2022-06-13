# PrivateEndpointResourceSchemaValidation

## Category

SDK Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The private endpoint model "{0}" schema does not conform to the common type definition.

## Description

This rule is to check if the schemas used by private endpoint conform to the common [privateLink](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/common-types/resource-management/v1/privatelinks.json). The rule will check the schemas of following models and their properties:

1. PrivateEndpointConnection
2. PrivateEndpointConnectionProperties
3. PrivateEndpointConnectionListResult
4. PrivateLinkResource
5. PrivateLinkResourceProperties
6. PrivateLinkResourceListResult

## CreatedAt

February 23, 2021

## LastModifiedAt

February 23, 2021

## Why this rule is important

The schemas used by private endpoint should have same definition.

## How to fix the violation

Please reference to the common private endpoint definition in [privateLink](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/common-types/resource-management/v1/privatelinks.json).
