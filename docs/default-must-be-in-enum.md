# DefaultMustBeInEnum

## Category

SDK Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

The default value is not one of the values enumerated as valid for this element.

## Description

The value assigned as a default for an enum property must be present in the enums' list.

## Why the rule is important

Generated SDKs in types languages may fail to compile if we try to enforce a default value that is not a part of the enums defined in the list and in other languages may fail in serialization/deserialization phases.

## How to fix the violation

Ensure that the default desired actually exists in the enums' list.

## Bad Example

```json
"status":{
  "type": "string",
  "enum": [
    "Succeeded",
    "Updating",
    "Deleting",
    "Failed"
  ],
  "default": "Terminated"
}
```
