# NonApplicationJsonType

## Category

ARM Warning

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

Only content-type 'application/json' is supported by ARM..

## Description

Verifies whether operation supports "application/json" as consumes or produces section.

## Why the rule is important

Per [ARM SDK guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/common-api-details.md#client-request-headers) only content-type 'application/json' is supported.

## How to fix the violation

Make sure to include only 'application/json' in the spec consumes/produces. Make sure your service supports 'application/json'.

## Examples

N/A
