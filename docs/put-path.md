# PutPath

## Category

Data Plane Warning

## Applies to

Data Plane OpenAPI specs

## Output Message

The path for a put should have a final path parameter.

## Description

The put method should be used for resource create or replace, which generally requires the resource id to specified as the final path parameter.

## CreatedAt

June 18, 2022

## LastModifiedAt

June 18, 2022

## How to fix the violation

If the put is creating a resource, then add a final path parameter.  Otherwise consider changing the operation to use the post method.
