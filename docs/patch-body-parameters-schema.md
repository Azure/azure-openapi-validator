# PatchBodyParametersSchema

## Category

ARM Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

Properties of a PATCH request body must not be {0}. PATCH operation: '{1}' Model Definition: '{2}' Property: '{3}'

## Description

A request parameter of the Patch Operation must not have a required/default value.
But it's allowed when the only required properties is marked as discriminator, because the discriminator must be required.

## CreatedAt

N/A

## LastModifiedAt

February 18, 2020

## Why the rule is important

A PATCH operation is used to update properties of a resource. So, If the resource has 'X' number of properties and if you wish to change one of them, then a PATCH request could be sent with a value for that specified property. In other words, all the properties in the PATCH request are updated. Now, if any of the values are marked as required/default, it would force the system to update it always which is not the intention of the PATCH operation.

## How to fix the violation

Ensure that the request parameter of the Patch Operation does not have a required/default value.A recommended way is to define a new model that only contains the patchable properties to replace the original parameter in request body.

## Good Examples

The following is a good example:
```json
......
......
  "patch": {
    "tags": [
      "SampleTag"
    ],
    "operationId": "Foo_Update",
    "description": "Test Description",
    "parameters": [
      {
        "name": "foo_patch",
        "in": "body",
        "schema": {
          "$ref": "#/definitions/FooRequestParams"
        },
        "description": "foo patch request"
      }
    ]
 }
......
......
  "definitions": {
    "FooRequestParams": {
      "properties": {
        "prop0": {
          "type": "string"
        }
      },
      "required": []
    }
  }
......
......
```
