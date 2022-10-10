# VersionPolicy

## Category

Data Plane Warning

## Applies to

Data Plane OpenAPI specs

## Output Message

One of:

- Version segment "v1" in basePath violates Azure versioning policy.
- Version segment "v1" in path violates Azure versioning policy.
- Operation does not define an "api-version" query parameter.
- "api-version" should be a required parameter

## Description

All services should follow the Azure API Guidelines for specifying the API version using a query parameter with a date-based value.

## CreatedAt

June 18, 2022

## LastModifiedAt

June 18, 2022

## How to fix the violation

Remove the api version from the path if present and add an `api-version` query parameter to all operations.
