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
      "type": {
        "readOnly": true,
        "type": "object",
        "description": "The additional info type."
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
      "type": {
        "readOnly": true,
        "type": "object",
        "info": {
          "readOnly": true,
          "type": "string"
        },
        "description": "The properties type."
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
      "type": {
        "readOnly": true,
        "type": "string",
      },
      "description": "The properties type."
    }
  }
}
...
```
