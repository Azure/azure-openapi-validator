# EnumMustRespectType

## Category

SDK Error

## Applies to

ARM and Data Plane OpenAPI(swagger) specs

## Output Message

Enum values should respect the type.

## Description

This rule is to check if the enum values conform to the type.

## CreatedAt

November 10, 2021

## LastModifiedAt

November 10, 2021

## Why this rule is important

It will lead to code generation failure in SDK generation pipeline.

## How to fix the violation

Just change the enum value to the right type.
