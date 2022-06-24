# OperationId

## Category

Data Plane Warning

## Applies to

Data Plane OpenAPI specs

## Output Message

One of:

- OperationId should be of the form "Noun_Verb"
- OperationId for put method should contain both "Create" and "Update"
- OperationId for get method on a collection should contain "List"
- OperationId for patch method should contain "Update"
- OperationId for delete method should contain "Delete"

## Description

OperationId should conform to Azure API Guidelines.

## CreatedAt

June 18, 2022

## LastModifiedAt

June 18, 2022

## How to fix the violation

Correct the operationId to follow the Azure Guidelines.
