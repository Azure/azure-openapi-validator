# AvoidAdditionalProperties

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Policy-V1-03

## Output Message

Definitions must not have properties named "additionalProperties".

## Description

Definitions must not have properties named "additionalProperties".

## CreatedAt

May 1, 2023

## LastModifiedAt

May 2, 2023

## How to fix the violation

Remove the additionalProperties type from the payload.

The following would be invalid because there is a property named "additionalProperties":

```json
...
"properties": {
    "additionalProperties": {
        "type": "object"
    }
}
...
```
