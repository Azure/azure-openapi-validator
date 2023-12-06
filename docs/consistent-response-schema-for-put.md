# ConsistentResponseSchemaForPut

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs


## Related ARM Guideline Code

- RPC-Put-V1-29

## Description
A PUT API must always return the same response schema for both the 200 and 201 status codes. The response schema must not vary between the initial PUT and the subsequent rePUTs. The schema represented by the response must always represent the same resource. 

## How to fix

Ensure that the response schema for 201 and 200 status codes match. 

## Bad example 

PUT with mismatch in response schemas between 200 and 201 status codes

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
        "responses": {
            "200": {
                "description": "The resource was replaced.",
                "schema": {
                    "$ref": "#/definitions/DataConnectorReplaceResponse"
                }
            },
            "201": {
                "description": "The resource was created.",
                "schema": {
                    "$ref": "#/definitions/DataConnector"
                }
            },
        }
```

## Good example

Put with matching response schemas between 200 and 201 status codes


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
        "responses": {
            "200": {
                "description": "The resource was replaced.",
                "schema": {
                    "$ref": "#/definitions/DataConnector"
                }
            },
            "201": {
                "description": "The resource was created.",
                "schema": {
                    "$ref": "#/definitions/DataConnector"
                }
            },
        }
```
