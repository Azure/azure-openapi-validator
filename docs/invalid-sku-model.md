# InvalidSkuModel

## Category

ARM Warning

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

Sku Model definition '{0}' is not valid. A Sku model must have 'name' property. It can also have 'tier', 'size', 'family', 'capacity' as optional properties.

## Description

Sku model definition needs to follow [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md) and can contain only a certain set of properties as described in the message.

## Why the rule is important

Per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md).

## How to fix the violation

Update the sku model definition.

## Examples

N/A
