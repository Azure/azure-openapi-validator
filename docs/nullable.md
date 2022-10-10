# Nullable

## Category

Data Plane Warning

## Applies to

Data Plane OpenAPI specs

## Output Message

Avoid the use of x-nullable.

## Description

You should avoid the use of `x-nullable: true`. Properties with no value should simply be omitted from the payload.

## CreatedAt

June 18, 2022

## LastModifiedAt

June 18, 2022

## How to fix the violation

Remove the `x-nullable: true` extension from the schema.
