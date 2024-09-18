# QueryParametersInCollectionGet

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Get-V1-15

## Description

Collection Get's/List operations MUST not have query parameters other than api-version & OData filter.

## How to fix the violation

Ensure that collection GET/List operations do not include any query parameters other than api-version and the OData $filter.

## Good Examples

```json
      "Microsoft.Music/Songs": {
        "get": {
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

```json
      "Microsoft.Music/Songs": {
        "get": {
          "operationId": "Foo_Update",
          "description": "Test Description",
          "parameters": [
            {
              "name": "api-version",
              "in": "query"
            },
            {
              "name": "$filter",
              "in": "query",
              "required": false,
              "type": "string",
            },
          ],
        },
      },
```

## Bad Examples

```json
      "Microsoft.Music/Songs": {
        "get": {
          "operationId": "Foo_Update",
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
      },
```
