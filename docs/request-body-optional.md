# RequestBodyOptional

## Category

Data Plane Warning

## Applies to

Data Plane OpenAPI specs

## Output Message

The body parameter is not marked as required.

## Description

The body parameter is not marked as required -- this is a common error.

While there are some cases where a body may be optional, they are rare.

## CreatedAt

June 18, 2022

## LastModifiedAt

June 18, 2022

## How to fix the violation

Mark the request body as `required: true` unless the operation really does allow a request with no body.
