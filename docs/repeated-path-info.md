# RepeatedPathInfo

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Put-V1-05

## Description

The '{property name}' already appears in the URI, please don't repeat it in the request body. Information in the URI must not be repeated in the request body (i.e. subscription ID, resource group name, resource name).

## How to fix

The violation can be fixed by removing the repeated properties in the request body schema.

## Good example

```
 "/subscriptions/{subscriptionId}/providers/Microsoft.MyNs/foo/{fooName}": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [
            {
              name: "fooName",
              in: "path",
              required: true,
              type: "string",
            },
            {
            "name": "MyResource",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/FooResource"
            },
          },
          ],
          responses: {},
        },
},
"definitions":{
  "FooResource": {
    "properties": {
      "properties": {
        "type": "object",
        "properties": {
          // No repeated subscriptionId, fooName properties.
          "friendlyName": {
            "type": "string",
            "description": "The friendly name of the resource",
          },
        },
      },
      },
    },
    "x-ms-azure-resource": true
  },
}
```
## Bad example

```
 "/subscriptions/{subscriptionId}/providers/Microsoft.MyNs/foo/{fooName}": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [
            {
              name: "fooName",
              in: "path",
              required: true,
              type: "string",
            },
            {
            "name": "MyResource",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/FooResource"
            },
          },
          ],
          responses: {},
        },
},
"definitions":{
  "FooResource": {
    "properties": {
      "properties": {
        "type": "object",
        "properties": {
          // repeated 'fooName' property.
          "fooName": {
            "type": "string",
            "description": "The name of the foo resource",
          },
        },
      },
      },
    },
    "x-ms-azure-resource": true
  },
}
```
