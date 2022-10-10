# UniqueClientParameterName

## Category

SDK Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

Do not have duplicate name of client parameter name, make sure every client parameter name unique.

## Description

This may cause a problem when different swagger files come together. If two APIs with different client name have the same client parameter subscriptionId, but with different reference name in swaggers, the generated model will also have two clients with two client parameters subscriptionId and subscriptionId1 (the latter one has been renamed to avoid collision). We should ensure that the client parameters are all unique in the same API version.

## Why this rule is important

Make sure no conflict in SDK generation.

## CreatedAt

November 30, 2020

## LastModifiedAt

November 30, 2020

## How to fix the violation

Remove duplicate client parameter, ref to the same one.
The following would be valid:

```json
...
 "/api": {
      "get": {
        "parameters": [
          {
            "$ref": "#/parameters/ApiVersionParameter"
          },
          {
            // ref to the same subcriptionId
            "$ref": "#/parameters/subscriptionIdParameter"
          },
        ],
     },
     "patch": [
          {
            "$ref": "#/parameters/ApiVersionParameter"
          },
          {
            "$ref": "#/parameters/subscriptionIdParameter"
          },
     ]
  }
...
```
