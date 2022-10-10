# XmsPageableMustHaveCorrespondingResponse

## Category

SDK Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The operation: '{operation name}' is defined with x-ms-pageable enabled,but can not find the corresponding nextLink property in the response, please add it.

## Description

Per [extensions](https://github.com/Azure/autorest/blob/main/docs/extensions/readme.md#x-ms-pageable) ,when specifying a x-ms-pageable/nextLinkName, the corresponding nextlink property must be defined in the response schema.

## CreatedAt

May 21, 2020

## LastModifiedAt

May 21, 2020

## How to fix the violation

Add the missing corresponding property like nextLink in response:

The following would be valid:

```json
...
"get":{
  ....
   "x-ms-pageable": {
          "nextLinkName": "nextLink"
  },
  ....
  "response":{
   "200": {
     "schema":{
       "description": "The list of metric items.",
        "type": "object",
        "properties": {
          "nextLink": {
            "description": "The link used to get the next page of operations.",
            "type": "string"
          }
        ....
     }
   }
  }
  ....
 }
}
...
```
