# RequestBodyMustExistForPutPatch

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs


## Related ARM Guideline Code

- RPC-Put-V1-28, RPC-Patch-V1-12

## Output Message

A Put or Patch request must always have a request body defined. 

## Description
This rule applies for tracked as well as proxy resources. This applies even in the case where there are no properties defined in the properties bag. 


## Why the rule is important

Making the request body mandatory for the Put or Patch request is to ensure that the output of the Get request may be passed in to the Put request and that can be achieved only if the Put has a request body defined. For Patch, it does not make sense to patch an empty payload.

## How to fix the violation

Add a request body for every Put or Patch operation defined in your swagger. This request body must also match the response body of the Put or Patch operation.

## Examples

## Bad example 1 

Put without a request body

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

## Bad example 2 

Put without a request body

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

## Good example

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
