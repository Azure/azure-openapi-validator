# ArraySchemaMustHaveItems

## Category

SDK Error

## Applies to

ARM and Data Plane OpenAPI(swagger) specs

## Output Message

Please provide an items property for array type: '{0}'.

## Description

A schema of `array` type must always contain an `items` property. without it, AutoRest will fail to generate an SDK.

## Why the rule is important

AutoRest needs to know the type of item contained in the array so that it can correctly generate the corresponding code.

## How to fix the violation

Correctly specify the `items` section for given array type. The items can be of any primitive type or can be a reference to another object type.

## Good Examples

Example with primitive type.

```json
"MyPrimitiveArray":{
  "type": "array",
  "items": {
    type: "number"
  }
}
```

Example with object reference type

```json
"MyComplexArray":{
  "type": "array",
  "items": {
    "$ref": "#/definitions/MySimpleObject"
  }
}
```
