# AvoidAdditionalProperties

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Policy-V1-03

## Output Message

The properties of type "Addiotinal Properties" are not allowed

## Description

If a property is of type additionalProperties then this should be flagged as an error

## CreatedAt

May 1, 2023

## LastModifiedAt

May 1, 2023

## How to fix the violation

Remove the additionalProperties type from the payload.

The following would be invalid:

```json
...
"properties": {
    "additionalProperties": {
        "type": "object"
    }
}
...
```
