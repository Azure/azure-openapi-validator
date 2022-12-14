# DeleteOperationResponses

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Delete-V1-01

## Output Message

The delete operation is defined without a 200 or 204 error response implementation,please add it.

## Description

Per ARM Specs, all DELETE methods (non-async) must have responses code implementation: 200, 204.

## CreatedAt

May 21, 2020

## LastModifiedAt

May 21, 2020

## How to fix the violation

For each operation response, please add the missing code response implementation:

The following would be valid:

```json
...
"path1":{
 "delete": {
   "parameters": [
     .....
     .....
   ]
  "response":{
   "default": {
     "schema":{
       "$ref":#/definition/Error
     }
   },
   "200": {
     "schema":{
       "$ref":#/definition/response
     }
   },
   "204": {
     "schema":{
       "$ref":#/definition/response
     }
   }
  }
 }
}
...
```
