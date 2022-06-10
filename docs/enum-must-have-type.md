# EnumMustHaveType

## Category

SDK Error

## Applies to

ARM and Data Plane OpenAPI(swagger) specs

## Output Message

Enum must define its type. All values in an enum must adhere to the specified type.

## Description

Enum must define type, and type must not be object. Or it will fail SDK auto-generation.

## CreatedAt

February 18, 2020

## LastModifiedAt

February 20, 2020

## How to fix the violation

Define type in enum.

Invalid:

```
"status":{
   "description":"The state code.",
   "enum":[
      "Success",
      "Failed"
   ],
   "readOnly":true,
   "x-ms-enum":{
      "name":"RespStatus",
      "modelAsString":true
   }
}
```

Valid:

```
"status":{
   "description":"The state code.",
   "enum":[
      "Success",
      "Failed"
   ],
   "readOnly":true,
   "type": "string",
   "x-ms-enum":{
      "name":"RespStatus",
      "modelAsString":true
   }
}
```
