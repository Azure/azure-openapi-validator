# MsPaths

## Category

Data Plane Warning

## Applies to

Data Plane OpenAPI specs

## Output Message

Don't use `x-ms-paths` except where necessary to support legacy APIs.

## Description

Don't use `x-ms-paths` except where necessary to support legacy APIs.
It is non-standard and therefore ignored by tooling that has not been specifically designed to support it.

## CreatedAt

June 18, 2022

## LastModifiedAt

June 18, 2022

## How to fix the violation

Change the API design to use the path to distinguish different operations.
