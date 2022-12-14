# RepeatedPathInfo

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Put-V1-05

## Output Message

The '{property name}' already appears in the URI, please don't repeat it in the request body.

## Description

Information in the URI should not be repeated in the request body (i.e. subscription ID, resource group name, resource name).

## CreatedAt

June 21, 2022

## LastModifiedAt

June 21, 2022

## How to fix the violation

Removing the repeated properties in the request body schema.
Bad example:

```
 "/subscriptions/{subscriptionId}/providers/Microsoft.MyNs/foo/{fooName}": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [
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
