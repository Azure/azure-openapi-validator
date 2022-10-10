# GuidUsage

## Category

ARM Warning

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

Guid used in model definition '{1}' for property '{0}'. Usage of Guid is not recommended. If GUIDs are absolutely required in your service, please get sign off from the Azure API review board.

## Description

Verifies whether format is specified as "uuid" or not.

## Why the rule is important

Per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md), GUID usage are discouraged.

## How to fix the violation

If GUIDs are absolutely required in your service, please get sign off from the Azure API review board.

## Impact on generated code

Based on each language generator, this may affect SDK.

## Examples

N/A
