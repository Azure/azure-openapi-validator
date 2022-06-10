# OperationIdRequired

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

Missing operationId. path:'${operation path}' operation:'${operation}'.

## Description

Each operation must have a unique operationId.

## CreatedAt

February 18, 2020

## LastModifiedAt

February 18, 2020

## Why this rule is important

Per [creating-swagger](creating-swagger.md#Paths),The operationId is used to determine the generated method name.

## How to fix the violation

Add the right operationId for each operation
