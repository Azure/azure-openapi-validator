# CollectionObjectPropertiesNaming

## Category

ARM Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

Collection object '{0}' returned by list operation '{1}' with 'x-ms-pageable' extension, has no property named 'value'.

## Description

Per ARM guidelines, a model returned by an `x-ms-pageable` operation must have a property named `value`. This property indicates what type of array the object is.

## Why the rule is important

To maintain consistency on how `x-ms-pageable` operations and corresponding response objects are modeled and to enable execution of other validation rules based on this consistent structure. More documentation about the extension can be found [here](https://github.com/Azure/azure-rest-api-specs/blob/main/documentation/swagger-extensions.md#x-ms-pageable).

## How to fix the violation

Ensure that the response object has a property named `value` of `array` type.
