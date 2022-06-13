# DefaultErrorResponseSchema

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The default error response schema SHOULD correspond to the schema documented at https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/common-api-details.md#error-response-content.

## Description

The default error response schema SHOULD correspond to the schema documented at [common-api-details](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/common-api-details.md#error-response-content).

## CreatedAt

April 2, 2020

## LastModifiedAt

April 2, 2020

## How to fix the violation

Following the ARM specification to modify the schema in the swagger file.
It's recommended to refer to the 'ErrorResponse' in [v2/types.json](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/common-types/resource-management/v2/types.json#L273) which is provided for fixing the error.

The following would be invalid:

```json
"definitions": {
  "ErrorResponse": {
     "properties": {
       "code": {
         "readOnly": true,
         "type": "string",
         "description": "The error code."
       },
       "message": {
         "readOnly": true,
         "type": "string",
         "description": "The error message."
       }
       ...
     }
  }
}
```

the correct schema:

```json
"definitions": {
  "ErrorResponse": {
     "properties": {
        "error": {
          "type": "object",
          "description": "The error object.",
          "properties": {
            "code": {
              "readOnly": true,
              "type": "string",
              "description": "The error code."
            },
            "message": {
              "readOnly": true,
              "type": "string",
              "description": "The error message."
            }
            ...
        }
     }
  }
}

```
