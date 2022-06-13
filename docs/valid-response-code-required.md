# ValidResponseCodeRequired

## Category

SDK Error

## Applies to

ARM and Data Plane OpenAPI(swagger) specs

## Output Message

There is no declared valid status code.

## Description

Every operation response must contain a valid code like "200","201","202" or "204" which indicates the operation is succeed and it's not allowed that a response schema just contains a "default" code.

## Why this rule is important

If a Swagger just contains "default" status code, this actually means "everything is an error". All track2 SDK will systematically raise an exception at runtime, if there is no declared valid status code.

## CreatedAt

November 23, 2020

## LastModifiedAt

November 23, 2020

## How to fix the violation

Add a valid response code .
The following would be valid:

```json
...
  "responses": {
      "200": {
        "description": "Succeeded",
        "schema": {
          "$ref": "#/definitions/MySimpleResource"
        }
      },
      "default": {
        "description": "Error response describing why the operation failed.",
        "schema": {
          "$ref": "#/definitions/ErrorResponse"
        }
      }
    }
  }
...
```
