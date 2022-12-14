# ApiVersionParameterRequired

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Uri-V1-08

## Description

Operation is missing the 'api-version' parameter.

## How to fix

Add the api-version parameters, like:

```json
"parameters": {
  "$ref": "../../v3/types.json#/parameters/ApiVersionParameter"
}
```
