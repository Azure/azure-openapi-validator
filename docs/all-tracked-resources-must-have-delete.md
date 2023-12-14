# AllTrackedResourcesMustHaveDelete

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Delete-V1-03

## Description

All tracked resources MUST support delete.

## How to fix

Add the delete operation for the tracked resource.

## Bad examples

## Bad example 1
```json
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.HDInsight/nodes/{nodeName}": {
      "get": {
        "tags": [
          "Nodes"
        ],
        "operationId": "Node_Get",
        "description": "Get HDInsightnode",
        "x-ms-examples": null,
        "parameters": [
          {
            "$ref": "#/parameters/SubscriptionIdParameter"
          },
          {
            "$ref": "#/parameters/ResourceGroupNameParameter"
          },
          {
            "$ref": "#/parameters/NodeNameParameter"
          },
          {
            "$ref": "#/parameters/ApiVersionParameter"
          }
        ],
        "responses": {
          "200": {
            "description": "OK response definition.",
            "schema": {
              "$ref": "./trackedResourceCommon.json#/definitions/Node" // Node is a tracked resource
            }
          },
          "default": {
            "description": "Error response describing why the operation failed.",
            "schema": {
              "$ref": "#/definitions/ErrorResponse"
            }
          }
        },
        "produces": [
          "application/json"
        ],
        "consumes": [
          "application/json"
        ]
      }
    }
```
## Bad example 2
```json
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.HDInsight/nodes/{nodeName}": {
      "get": {
        "tags": [
          "Nodes"
        ],
        "operationId": "Node_Get",
        "description": "Get HDInsightnode",
        "x-ms-examples": null,
        "parameters": [
          {
            "$ref": "#/parameters/SubscriptionIdParameter"
          },
          {
            "$ref": "#/parameters/ResourceGroupNameParameter"
          },
          {
            "$ref": "#/parameters/NodeNameParameter"
          },
          {
            "$ref": "#/parameters/ApiVersionParameter"
          }
        ],
        "responses": {
          "200": {
            "description": "OK response definition.",
            "schema": {
              "$ref": "./trackedResourceCommon.json#/definitions/Node" // Node is a tracked resource
            }
          },
          "default": {
            "description": "Error response describing why the operation failed.",
            "schema": {
              "$ref": "#/definitions/ErrorResponse"
            }
          }
        },
        "produces": [
          "application/json"
        ],
        "consumes": [
          "application/json"
        ]
      },
      "put": {
        "tags": [
          "Nodes"
        ],
        "operationId": "Node_CreateOrUpdate",
        "description": "Put HDInsightnode",
        "x-ms-examples": null,
        "parameters": [
          {
            "$ref": "#/parameters/SubscriptionIdParameter"
          },
          {
            "$ref": "#/parameters/ResourceGroupNameParameter"
          },
          {
            "$ref": "#/parameters/NodeNameParameter"
          },
          {
            "$ref": "#/parameters/ApiVersionParameter"
          }
        ],
        "responses": {
          "200": {
            "description": "OK response definition.",
            "schema": {
              "$ref": "./trackedResourceCommon.json#/definitions/Node" // Node is a tracked resource
            },
          "201": {
            "description": "OK response definition.",
            "schema": {
              "$ref": "./trackedResourceCommon.json#/definitions/Node" // Node is a tracked resource
            }
          },
          "default": {
            "description": "Error response describing why the operation failed.",
            "schema": {
              "$ref": "#/definitions/ErrorResponse"
            }
          }
        },
        "produces": [
          "application/json"
        ],
        "consumes": [
          "application/json"
        ]
      }
    }
```


## Good example

```json
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.HDInsight/nodes/{nodeName}": {
      "get": {
        "tags": [
          "Nodes"
        ],
        "operationId": "Node_Get",
        "description": "Get HDInsightnode",
        "x-ms-examples": null,
        "parameters": [
          {
            "$ref": "#/parameters/SubscriptionIdParameter"
          },
          {
            "$ref": "#/parameters/ResourceGroupNameParameter"
          },
          {
            "$ref": "#/parameters/NodeNameParameter"
          },
          {
            "$ref": "#/parameters/ApiVersionParameter"
          }
        ],
        "responses": {
          "200": {
            "description": "OK response definition.",
            "schema": {
              "$ref": "./trackedResourceCommon.json#/definitions/Node" // Node is a tracked resource
            }
          },
          "default": {
            "description": "Error response describing why the operation failed.",
            "schema": {
              "$ref": "#/definitions/ErrorResponse"
            }
          }
        },
        "produces": [
          "application/json"
        ],
        "consumes": [
          "application/json"
        ]
      },
      "put": {
        "tags": [
          "Nodes"
        ],
        "operationId": "Node_CreateOrUpdate",
        "description": "Put HDInsightnode",
        "x-ms-examples": null,
        "parameters": [
          {
            "$ref": "#/parameters/SubscriptionIdParameter"
          },
          {
            "$ref": "#/parameters/ResourceGroupNameParameter"
          },
          {
            "$ref": "#/parameters/NodeNameParameter"
          },
          {
            "$ref": "#/parameters/ApiVersionParameter"
          }
        ],
        "responses": {
          "200": {
            "description": "OK response definition.",
            "schema": {
              "$ref": "./trackedResourceCommon.json#/definitions/Node" // Node is a tracked resource
            },
          "201": {
            "description": "OK response definition.",
            "schema": {
              "$ref": "./trackedResourceCommon.json#/definitions/Node" // Node is a tracked resource
            }
          },
          "default": {
            "description": "Error response describing why the operation failed.",
            "schema": {
              "$ref": "#/definitions/ErrorResponse"
            }
          }
        },
        "produces": [
          "application/json"
        ],
        "consumes": [
          "application/json"
        ]
      }
    },
    "delete": {
      "tags": [
        "Nodes"
      ],
      "operationId": "Node_Delete",
      "description": "Delete HDInsightnode",
      "x-ms-examples": null,
      "parameters": [
        {
          "$ref": "#/parameters/SubscriptionIdParameter"
        },
        {
          "$ref": "#/parameters/ResourceGroupNameParameter"
        },
        {
          "$ref": "#/parameters/NodeNameParameter"
        },
        {
          "$ref": "#/parameters/ApiVersionParameter"
        }
      ],
      "responses": {
        "200": {
          "description": "Resource deleted successfully."
        },
        "204": {
          "description": "Resource is already deleted.",
        },
        "default": {
          "description": "Error response describing why the operation failed.",
          "schema": {
            "$ref": "#/definitions/ErrorResponse"
          }
        }
      },
      "produces": [
        "application/json"
      ],
      "consumes": [
        "application/json"
      ]
    }
  }    
```
