# RequestBodyMustExistForPutPatch

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs


## Related ARM Guideline Code

- RPC-Put-V1-28, RPC-Patch-V1-12

## Description
A PUT or Patch request must always have a request body defined. This rule applies to all ARM resources (Tracked and proxy). PUT and patch operations using an empty payload is not allowed in ARM.

## How to fix

Add a request body for every PUT or Patch operation defined in your swagger. This request body must also match the response body of the PUT or Patch operation.

## Bad examples 

PUT without a request body

```json5
 "put": {
        "tags": [
          "DataConnectors"
        ],
        ...
        "parameters": [
          {
            "$ref": "../../../../../common-types/resource-management/v4/types.json#/parameters/ResourceGroupNameParameter"
          },
          ....
          {
            "in": "body",
            "name": "body",
            "description": "Body must be valid DataConnector request.",
            "required": true,
            
            // No schema specified here....
             
          }
        ],
```

Another Put operation without a request body

```json5
 "put": {
        "tags": [
          "DataConnectors"
        ],
        ...
        "parameters": [
          {
            "$ref": "../../../../../common-types/resource-management/v4/types.json#/parameters/ResourceGroupNameParameter"
          },
          ....
          // No body parameter specified here....
        ],
```

## Good examples

Put with a request body

```json5
 "put": {
        "tags": [
          "DataConnectors"
        ],
        ...
        "parameters": [
          ...
          {
            "in": "body",
            "name": "body",
            "description": "Body must be valid DataConnector request.",
            "required": true,
            "schema": {
              "$ref": "#/definitions/DataConnector"
            }
          }
        ],
```
