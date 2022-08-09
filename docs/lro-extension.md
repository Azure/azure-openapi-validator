# LroExtension

## Category

Data Plane Warning

## Applies to

Data Plane OpenAPI specs

## Output Message

Operations with a 202 response should specify `x-ms-long-running-operation: true`.

## Description

Operations with a 202 response should specify `x-ms-long-running-operation: true`.

## CreatedAt

June 18, 2022

## LastModifiedAt

June 18, 2022

## How to fix the violation

Add the `x-ms-long-running-operation: true` extension to the operation.
