# NamePropertyDefinitionInParameter

## Category

SDK Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

Parameter Must have the "name" property defined with non-empty string as its value.

## Description

A parameter must have a `name` property for the SDK to be properly generated.

## Why the rule is important

AutoRest fails to generate code if the `name` property is not provided for a parameter.

## How to fix the violation

Add a non-empty `name` property to the parameter.

## Good Example

```json
"MyParam":{
  "name":"myParam",
  "type": "string",
  "in": "path",
  "description": "sample param"
}
```

## Bad Example

```json
"MyParam":{
  "type": "string",
  "in": "path",
  "description": "sample param"
}
```
