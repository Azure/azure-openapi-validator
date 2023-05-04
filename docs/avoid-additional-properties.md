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

```json
...
"properties": {
    "additionalProperties": {
        "type": "object"
    }
}
...
```

This above payload is considered invalid because ARM requires Resource provider teams to define the types explicitly. This is to ensure good customer experience in terms of the discoverability of concrete type definitions. If you believe your scenario requires the use of additionalProperties please reach out to the current API reviewer on-call to explain the reasoning.
