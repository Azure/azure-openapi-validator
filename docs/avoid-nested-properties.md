# AvoidNestedProperties

## Category

SDK Warning

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

Consider using x-ms-client-flatten to provide a better end user experience

## Description

Nested properties can result into bad user experience especially when creating request objects. `x-ms-client-flatten` flattens the model properties so that the users can analyze and set the properties much more easily.

## Why the rule is important

Overly nested properties (especially required ones) can result into a non optimal user experience.

## How to fix the violation

Either eliminate nesting or use the `x-ms-client-flatten` property for a better user experience. More details about the extension can be found [here](https://github.com/Azure/autorest/blob/main/docs/extensions/readme.md#x-ms-client-flatten).
