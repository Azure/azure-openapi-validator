# UniqueXmsExample

## Category

SDK Warning

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

Do not have duplicate name of x-ms-example, make sure every x-ms-example name unique. Duplicate x-ms-example: {ExampleName}

## Description

x-ms-example name should be unique in the same API version.

## Why this rule is important

Duplicate example name will bring trouble for test codegen. For example: hard to config used example.

## CreatedAt

November 30, 2020

## LastModifiedAt

November 30, 2020

## How to fix the violation

Rename duplicate x-ms-example name
The following would be valid:

```json
...
"x-ms-examples": {
          "Create resource": {
            "$ref": "./examples/createResource"
          },
          "Update resource":{
            "$ref": "./examples/updateResource"
          }

        }
...
```
