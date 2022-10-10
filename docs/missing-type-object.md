# MissingTypeObject

## Category

SDK Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

The schema '{json path}' is considered an object but without a 'type:object', please add the missing 'type:object'.

## Description

The rule should apply to any schema with "properties" or "additionalProperties". It is to ensure a schema with "properties" or "additionalProperties" must have explicit "type:object" statement, which means a schema is an object.

## CreatedAt

May 24, 2021

## LastModifiedAt

May 24, 2021

## Why this rule is important

The semantics of with and without "type:object" are different. With “type:object” means “it has to be an object”. Without “type: object” means “it could be any type”. Azure SDK Track 2 generator will honor the difference, and generate different SDK codes.
A free-form object would like:

## How to fix the violation

Just add the missing 'type:object'.

The following would be valid:

```json
 "foo": {
    "type":"object",
    "properties": {
      "a" : {
        "type":"string"
      }
      ...
    }
 }
```

The following would be invalid by default (unless you do it on purpose , then a suppression is required):

```json
 "foo": {
    "properties": {
      "a" : {
        "type":"string"
      }
      ...
    }
```
