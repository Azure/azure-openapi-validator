# ApiVersionEnum

## Category

Data Plane Warning

## Applies to

Data Plane OpenAPI specs

## Output Message

The `api-version` parameter should not be an enum.

## Description

The `api-version` parameter should not be an enum. This rule is primarily to discourage a practice observed
in some APIs of defining `api-version` as an enum with a single value -- the most current API version.
This requires removing the old API version when a new version is defined, which is disallowed by the breaking changes policy.

## CreatedAt

June 18, 2022

## LastModifiedAt

June 18, 2022

## How to fix the violation

Remove the enum from the `api-version` parameter.
