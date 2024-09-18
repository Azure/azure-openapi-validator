# ValidQueryParametersForPointOperations

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Uri-V1-13

## Description

Point operations (GET, PUT, PATCH, DELETE) must not include any query parameters other than api-version.

## How to fix the violation

Remove all query params other than api-version for point operations (GET, PUT, PATCH, DELETE).

## Good Examples

```json
    "Microsoft.Music/Songs": {
      "get": {
        "operationId": "Foo_Get",
        "description": "Test Description",
        "parameters": [
          {
            "name": "api-version",
            "in": "query"
          },
        ],
      },
      "put": {
        "operationId": "Foo_Update",
        "description": "Test Description",
        "parameters": [
          {
            "name": "api-version",
            "in": "query"
          },
        ],
      },
      "patch": {
        "operationId": "Foo_Update",
        "description": "Test Description",
        "parameters": [
          {
            "name": "api-version",
            "in": "query"
          },
        ],
      },
      "delete": {
        "operationId": "Foo_Update",
        "description": "Test Description",
        "parameters": [
          {
            "name": "api-version",
            "in": "query"
          },
        ],
      },
    },
```

## Bad Examples

```json
    "Microsoft.Music/Songs": {
      "get": {
        "operationId": "Foo_get",
        "description": "Test Description",
        "parameters": [
          {
            "name": "name",
            "in": "query",
            "required": false,
            "type": "string",
          },
        ],
      },
      "put": {
        "operationId": "Foo_Create",
        "description": "Test Description",
        "parameters": [
          {
            "name": "$filter",
            "in": "query"
          },
        ],
      },
      "patch": {
        "operationId": "Foo_Update",
        "description": "Test Description",
        "parameters": [
          {
            "name": "name",
            "in": "query"
          },
        ],
      },
    },
```