# ParametersOrder

## Category

SDK Error

## Applies to

ARM and Data Plane OpenAPI(swagger) specs

## Output Message

The parameters should be kept in the same order as they present in the path.

## Description

The rule is to ensure the parameters in the same order as they are ranked in the path. Since it can introduce a breaking change when updating parameter order, for services that have already shipped public versions, you may request to suppress the rule following the process documented here: https://dev.azure.com/azure-sdk/internal/_wiki/wikis/internal.wiki/85/Swagger-Suppression-Process

## CreatedAt

November 8, 2021

## LastModifiedAt

November 8, 2021

## Why this rule is important

AutoRest generates SDKs with parameters in the order as they are defined in the Swagger. The only exceptional cases are:

1. 'body' should be always at last;
2. 'required' should be always placed before 'optional'

## How to fix the violation

re-order the parameters as the order in the api path.
