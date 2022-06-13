# EnumMustNotHaveEmptyValue

## Category

SDK Error

## Applies to

ARM and Data Plane OpenAPI(swagger) specs

## Output Message

Enum value must not contain empty value.

## Description

Enum must not be empty, or contain special character, like space, tab, etc. It will lead to code generation failure in downstream pipeline.

## CreatedAt

February 18, 2020

## LastModifiedAt

February 18, 2020

## How to fix the violation

Remove empty string from enum.

Invalid:

```
"enum":[
   "Success",
   "Failed",
   "       "
]
```

Valid:

```
"enum":[
   "Success",
   "Failed",
]
```
