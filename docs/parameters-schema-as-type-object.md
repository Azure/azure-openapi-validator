# ParametersSchemaAsTypeObject

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Arg-V1-01

## Output Message

The schema for body parameters must specify type:object and include a definition for its reference model.

## Description

The schema for body parameters should be defined strictly with the type set as 'object', as ARM does not support other types of definitions. This restriction is in place to ensure a better customer experience.

## How to fix the violation

Please set schema `"type": "object"` in the parameters and define the reference model of the object.

## Good Example 1

```json
...
{
  "parameters": {
    "ApiVersionParameter": {
      "name": "api-version",
      // not a body parameter
      "in": "query",
      "required": true,
      // no schema
      "type": "string",
      "description": "The HDInsight client API Version."
    }
  }
}
...
```

## Good Example 2

```json
...
{
  "parameters": {
    "ResourceGroupName": {
      "name": "resourceGroupName",
      // body parameter
      "in": "body",
      "required": true,
      "schema": {
        // refer schema from the definitons
        "$ref": "#/definitions/ResourceGroup"
      },
      "description": "The name of the resource group.",
      "x-ms-parameter-location": "method"
    }
  }
}
...
```

## Good Example 3

```json
...
{
  "parameters": {
    "ResourceGroupName": {
      "name": "resourceGroupName",
      // body parameter
      "in": "body",
      "required": true,
      "schema": {
        // define schema with type:object
        "type": "object",
        "Resource": {
          "description": "The resource",
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "The name of the Resource"
            }
          }
        }
      },
      "description": "The name of the resource group.",
      "x-ms-parameter-location": "method"
    }
  }
}
...
```

## Bad Example 1

```json
...
{
  "parameters": {
    "ResourceGroupName": {
      "name": "resourceGroupName",
      "in": "body",
      "required": true,
      "schema": {
        // object not defined
        "type": "object",
      },
      "description": "The name of the resource group.",
      "x-ms-parameter-location": "method"
    }
  }
}
...
```

## Bad Example 2

```json
...
{
  "parameters": {
    "ResourceGroupName": {
      "name": "resourceGroupName",
      "in": "body",
      "required": true,
      "schema": {
        // type:string is not allowed for body parameters
        "type": "string",
      },
      "description": "The name of the resource group.",
      "x-ms-parameter-location": "method"
    }
  }
}
...
```