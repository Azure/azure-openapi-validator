# ParameterDefaultNotAllowed

## Category

Data Plane Warning

## Applies to

Data Plane OpenAPI specs

## Output Message

A required parameter should not specify a default value.

## Description

A required parameter should not specify a default value.

## CreatedAt

June 18, 2022

## LastModifiedAt

June 18, 2022

## How to fix the violation

Remove `default` from the parameter.
Use the [`x-ms-client-default` extension](https://github.com/Azure/autorest/tree/main/docs/extensions#x-ms-client-default)
supported by autorest to specify a value to be passed by generated clients if the user does not specify a value.
