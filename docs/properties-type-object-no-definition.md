# PropertiesTypeObjectNoDefinition

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Policy-V1-03

## Output Message

Properties with type:object should have definition of a reference model

## Description

If Properties with type:object dont have a reference model defined, then the allowed types can only be primitive data types instead of type:object

## CreatedAt

April 18, 2023

## LastModifiedAt

May 03, 2023

## How to fix the violation

The "type:object" model is not defined in the payload.
Define the reference model of the object or change the "type" to "primitive-data-type".
The following would be invalid:

```json
...
"properties": {
    "info": {
        "type": "object",
    }
}
...
```
