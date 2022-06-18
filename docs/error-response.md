# ErrorResponse

## Category

Data Plane Warning

## Applies to

Data Plane OpenAPI specs

## Output Message

One of:

- Error response schema must be an object schema.
- Error response schema should contain an object property named `error`.
- The `error` property in the error response schema should be required.
- Error schema should contain `code` property.
- Error schema should contain `message` property.
- The `code` property of error schema should be type `string`.
- The `message` property of error schema should be type `string`.
- Error schema should define `code` property as required.
- Error schema should define `message` property as required.
- Error response should contain a x-ms-error-code header.

## Description

Error response body should conform to [Azure API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md#handling-errors).

## CreatedAt

June 18, 2022

## LastModifiedAt

June 18, 2022

## How to fix the violation

Correct the error response schema.
