# AvoidEmptyResponseSchema

## Category

SDK Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

Response schema must not be empty.

## Description

Response schema must not be empty, or it will block code generation.

## CreatedAt

April 2, 2020

## LastModifiedAt

April 2, 2020

## How to fix the violation

Add the correct definition of the schema in the response or remove it if don't need.

The following would be invalid:

```json
...
 "response":{
   "default": {
     "schema":{
     }
  }
 }
...
```
