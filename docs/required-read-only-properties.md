# RequiredReadOnlyProperties

## Category

SDK Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

Property '{0}' is a required property. It should not be marked as 'readonly'.

## Description

A model property cannot be both `readOnly` and `required`. A `readOnly` property is something that the server sets when returning the model object while `required` is a property to be set when sending it as a part of the request body.

## Why the rule is important

SDK generation fails when this rule is violated.

## How to fix the violation

Ensure that the given property is either marked as `readonly: true` or `required` but not both.

## Bad Example

```json
"MyModel": {
  "properties":{
    "MyProp":{
      "type": "string",
      "description": "sample prop",
      "readOnly": true
    }
  },
  "required": ["MyProp"]
}
```
