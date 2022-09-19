# ApiVersionParameterRequired

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-V2-URI-9

## Description

This rule applies when the 'api-version' parameter is missing in any operations.

## How to fix

Add the api-version parameters, like:

```json
"parameters": {
  "$ref": "../../v3/types.json#/parameters/ApiVersionParameter"
}
```
