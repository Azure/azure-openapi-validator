# GetOperation200

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Get-V1-01

## Output Message

The get operation should only return 200.

## Description

The get operation should only return 200, also it should not be a long running operation.

## CreatedAt

July 07, 2022

## LastModifiedAt

July 07, 2022

## How to fix the violation

Considering removing the other response codes except 200.
