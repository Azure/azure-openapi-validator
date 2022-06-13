# XmsIdentifierValidation

## Category

SDK Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

Missing identifier {0} in array item property.

## Description

This rule is to check the `id` property or identifier of objects in the array. See more here: [x-ms-identifiers](https://github.com/Azure/autorest/tree/main/docs/extensions#x-ms-identifiers).

## CreatedAt

Decenmber 15, 2021

## LastModifiedAt

Decenmber 15, 2021

## Why this rule is important

Using [x-ms-identifiers](https://github.com/Azure/autorest/tree/main/docs/extensions#x-ms-identifiers) will provide more flexibility for array types in SDK generated code.

## How to fix the violation

If you don't need identifier in array, leave `x-ms-identifiers` as an empty array. Otherwise, add the identifying property in the object or correct the `x-ms-identifiers`.
