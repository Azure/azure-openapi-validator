# IntegerTypeMustHaveFormat

## Category

SDK Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The integer type does not have a format, please add it.

## Description

The type:integer must have a required format. Possible value for format are int32 and int64.

## CreatedAt

May 21, 2020

## LastModifiedAt

May 21, 2020

## Why this rule is important

Right now it's possible to type a field as integer, but not specifying format. It actually creates problems for generate when the number of bits matter, like C#.

## How to fix the violation

Add the correct format for integer type:

The following would be valid:

```json
...
  "incomingChanges": {
          "type": "integer",
          "format": "int64",
      ....
  }
...
```
