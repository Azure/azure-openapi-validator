# EnumUniqueValue

## Category

SDK Error

## Applies to

ARM and Data Plane OpenAPI(swagger) specs

## Output Message

Enum must not contain duplicated value (case insensitive).

## Description

Enum must not contain duplicated value (case insensitive).

## CreatedAt

February 18, 2020

## LastModifiedAt

February 18, 2020

## How to fix the violation

Remove duplicated value in enum.

Eg: In this case, you need to remove 'Failed' or 'FAILED'.

Invalid:

```
"enum": [
            "Success",
             "Failed",
             "FAILED"
]
```

Valid:

```
"enum": [
            "Success",
             "Failed",
]
```
