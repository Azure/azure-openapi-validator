# AvoidAdditionalProperties

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Policy-V1-05, RPC-Put-V1-23

## Output Message

Definitions must not have properties named "additionalProperties" except for user defined tags or predefined references.

## Description

Definitions must not have properties named "additionalProperties".

The following are the only scenarios where "additionalProperties" are allowed

 1. User defined tags.

```json
...
"properties": {
    "tags": {
        "additionalProperties": {
            "type": "object"
        }
    }
}
...
```

 2. Predefined refrences such as common-types.

```json
...
"properties": {
    "identity": {
        "$ref": "../../../../../common-types/resource-management/v5/managedidentity.json#/definitions/ManagedServiceIdentity"
    },
}
...
```


## CreatedAt

May 1, 2023

## LastModifiedAt

May 10, 2023

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

The above payload is considered invalid because ARM requires Resource provider teams to define the types explicitly. This is to ensure good customer experience in terms of the discoverability of concrete type definitions. If you believe your scenario requires the use of additionalProperties please reach out to the current API reviewer on-call to explain the reasoning.

Valid Example
You can refer from 
