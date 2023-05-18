# PropertiesTypeObjectNoDefinition

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Policy-V1-03

## Output Message

Properties with type:object must have definition of a reference model.

## Description

Properties with type:object that dont reference a model definition are not allowed. ARM doesnt allow generic type definitions as this leads to bad customer experience.

## CreatedAt

April 18, 2023

## LastModifiedAt

May 16, 2023

## How to fix the violation

The "type:object" model is not defined in the payload.
Define the reference model of the object or change the "type" to a primitive data type like string, int, etc.
The following would be invalid:

```json
...
{
  "definitions": {
    "type": "object",
    "properties": {
      "type": "object",
      "info": {
        "readOnly": true,
        "description": "The additional info type.",
        "type": "object"
      }
    }
  }
}
...
```

A valid example of reference model:

```json
...
{
  "definitions": {
    "type": "object",
    "properties": {
      "info": {
        "readOnly": true,
        "type": "object",
        "description": "The properties type.",
        "details": {
          "readOnly": true,
          "type": "string"
        }
      }
    }
  }
}
...
```

A valid example of primitve data type:

```json
...
{
  "definitions": {
    "type": "object",
    "properties": {
      "description": "The properties type.",
      "info": {
        "readOnly": true,
        "type": "string"
      }
    }
  }
}
...
```
