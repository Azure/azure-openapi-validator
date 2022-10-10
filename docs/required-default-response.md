# RequiredDefaultResponse

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The response is defined without a default error response implementation,please add it.

## Description

Per ARM Specs, every operation must have a default error response implementation.

## CreatedAt

May 21, 2020

## LastModifiedAt

May 21, 2020

## How to fix the violation

For each operation response, please add a default error response implementation:
The following would be valid:

```json
...
 "responses":{
   "default": {
     "schema":{
       "$ref":#/definition/Error
     }
  }
 }
...
```
