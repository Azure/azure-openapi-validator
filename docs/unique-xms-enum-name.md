# UniqueXmsEnumName

## Category

SDK Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

Must not have duplicate name in x-ms-enum extension , make sure every x-ms-enum name unique.

## Description

This rule will check all the swagger files with the same api-version, and ensure there is no duplicate x-ms-enum name.
The following cases are deemed as violation:

1. if two enums have the same x-ms-enum name , but types are different.
2. if two enums have the same x-ms-enum name , but 'modelAsString' are different.
3. if two enums have the same x-ms-enum name , but include different values.
4. if two enums have the same x-ms-enum name and 'modelAsString' is false , but enums' values have different order.

## CreatedAt

March 18, 2020

## LastModifiedAt

January 14, 2021

## How to fix the violation

Update the duplicate x-ms-enum name :

The following would be invalid:

```json
    "State": {
        "description": "The state of the configuration store.",
        "enum": [
            "Failed",
            "Canceled"
        ],
        "type": "string",
        "readOnly": true,
        "x-ms-enum": {
            "name": "DuplicateName",
            "modelAsString": true
        }
    },
    "status": {
        "description": "The state code.",
        "enum": [
            "Success",
            "FAILED"
        ],
        "readOnly": true,
        "type": "string",
        "x-ms-enum": {
            "name": "DuplicateName",
            "modelAsString": true
        }
    }
}
```
