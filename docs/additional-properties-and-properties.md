# AdditionalPropertiesAndProperties

## Category

Data Plane Warning

## Applies to

Data Plane OpenAPI specs

## Output Message

Don't specify additionalProperties as a sibling of properties.

## Description

Don't specify both additionalProperties and properties in the same object schema. Only use additionalProperties to define "map" structures.

## CreatedAt

June 18, 2022

## LastModifiedAt

June 18, 2022

## How to fix the violation

Remove `additionalProperties` from the schema and add a new object property to hold the additional properties.
