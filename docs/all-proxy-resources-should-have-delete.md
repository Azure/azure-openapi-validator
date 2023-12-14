# AllProxyResourcesShouldHaveDelete

## Category

ARM Warning

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Delete-V1-05

## Description

All proxy resources that have a put operation defined should also support a delete operation. This makes the APIs intuitive for customers as they would expect every resource that they have the ability to create to also be deletable. There are rare sceanrios where a customer is allowed to create and replace a resource but never be able to delete them. In such cases it is ok to not implement a delete but such cases are very rare and should be avoided. 

## How to fix

Consider adding the delete operation for the proxy resource that has a PUT.

## Bad examples

A proxy resource having a put operation but no delete operation
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
              "$ref": "./proxyResourceCommon.json#/definitions/Node" // Node is a proxy resource
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
              "$ref": "./proxyResourceCommon.json#/definitions/Node" // Node is a proxy resource
            },
          "201": {
            "description": "OK response definition.",
            "schema": {
              "$ref": "./proxyResourceCommon.json#/definitions/Node" // Node is a proxy resource
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

## Good example 1 
A proxy resource having both put and delete operations

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
              "$ref": "./proxyResourceCommon.json#/definitions/Node" // Node is a proxy resource
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
              "$ref": "./proxyResourceCommon.json#/definitions/Node" // Node is a proxy resource
            },
          "201": {
            "description": "OK response definition.",
            "schema": {
              "$ref": "./proxyResourceCommon.json#/definitions/Node" // Node is a proxy resource
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
## Good example 2 
A read only proxy resource having no put or delete operations

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
              "$ref": "./proxyResourceCommon.json#/definitions/Node" // Node is a proxy resource
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