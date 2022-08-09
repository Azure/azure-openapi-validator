# AdditionalPropertiesObject

## Category

Data Plane Warning

## Applies to

Data Plane OpenAPI specs

## Output Message

additionalProperties with type object is a common error.

## Description

Specifying `additionalProperties` with `type: object` is a common error.

## CreatedAt

June 18, 2022

## LastModifiedAt

June 18, 2022

## How to fix the violation

If you intend to allow property values of any type (not just JSON objects), simply omit the `type`, e.g.:

```json
    "additionalProperties": {}
```
