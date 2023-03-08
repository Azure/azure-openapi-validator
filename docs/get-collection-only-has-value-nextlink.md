# GetCollectionOnlyHasValueAndNextLink

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

Get endpoints for collections of resources must only have the `value` and `nextLink` properties in their model.

## Description

List GET endpoints (collection GET) must only have `value` and `nextLink` in `properties`.

## Why the rule is important

This rule is important to retain consistency between ARM APIs. Furthermore, not adhering to this rule will cause issues with Azure Resource Graph (ARG) integration.

## How to fix the violation

Under `properties` in the schema for GET endpoints, ensure the fields `value` and `nextLink` are present, and no other fields are present.
