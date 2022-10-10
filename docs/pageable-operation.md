# PageableOperation

## Category

SDK Warning

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

Based on the response model schema, operation '${operationId}' might be pageable. Consider adding the x-ms-pageable extension.

## Description

This rule was introduced to check if a pageable operation has x-ms-pageable enabled.

## How to fix the violation

Having the x-ms-pageable enabled if the operation is pageable.
Eg:

```json
......
......
  "get": {
        "operationId": "Foo_List",
        "responses": {
          "200": {
            "description": ". ",
            "schema": {
              "$ref": "#/definitions/ant"
            }
          }
        },
        "x-ms-pageable": {
          "nextLinkName": "nextLink"
        }
      }
......
......
```
