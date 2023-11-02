# GetResponseCodes

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Get-V1-01

## Output Message

The get operation should only return 200.
In addition, it can return 202 only if it has "Location" header defined (i.e, if it is a polling action).

## Description

The get operation should only return 200, also it should not be a long running operation.
In addition, it can return 202 only if it has location header defined (i.e, if it is a polling action).

## CreatedAt

July 07, 2022

## LastModifiedAt

July 07, 2022

## How to fix the violation

Remove all the other response codes except 200 and 202 with "Location" header defined
i.e, remove response codes 201, 202(if no "Location" header defined), 203, 204.
