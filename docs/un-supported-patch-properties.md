# UnSupportedPatchProperties

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Patch-V1-02

## Description

The patch operation body parameter schema must not contain top level "id", "name", "type", "location" as writable properties. The operation body parameter schema must also not contain provisioningState in the properties bag as a writable property. This is because these properties are not patchable. To fix this, either remove the offending properties from the request payload of the Patch operation, or mark them as readOnly or immutable. A Patch operation may not change the id, name, type, location, or properties.provisioningState of the resource.

## How to fix

Consider either removing the top-level properties - "id", "name", "type", "properties.provisioningState", from the patch request body parameter schema, or mark them as readOnly. For the top-level "location" property (that is specified for tracked resources), consider either removing it from the request body of the Patch operation or mark it as immutable using the x-ms-mutability property and values as "create" and "read".

## Bad examples

## Bad example 1 

Top level property 'name' is specified as a writable property
```json
    paths: {
      "/foo": {
        patch: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_patch",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "Success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          },
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          name: {
            type: "string",
          },
        },
      },
      Resource: {
        "x-ms-azure-resource": true,
        description: "Test Description",
        properties: {
          id: {
            type: "string",
            readOnly: true,
          },
          name: {
            type: "string",
            readOnly: true,
          },
          type: {
            type: "string",
            readOnly: true,
          },
        },
      },
      FooResource: {
        "x-ms-azure-resource": true,
        allOf: [{ $ref: "#/definitions/Resource" }],
        properties: {
          provisioningState: {
            type: "string",
            enum: ["Creating", "Canceled", "Deleting", "Failed"],
          },
        },
      },
    },
...

## Bad example 2 

Property 'properties.provisioningState' is specified as a writable property
```json
    paths: {
      "/foo": {
        patch: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_patch",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "Success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          },
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooResource",
          },
        ],
      },
      FooProps: {
        properties: {
          name: {
            type: "string",
          },
        },
      },
      Resource: {
        "x-ms-azure-resource": true,
        description: "Test Description",
        properties: {
          id: {
            type: "string",
            readOnly: true,
          },
          name: {
            type: "string",
            readOnly: true,
          },
          type: {
            type: "string",
            readOnly: true,
          },
          location: {
            type: "string",
            "x-ms-mutability": ["read", "create"],
            description: "The geo-location where the resource lives",
          },
        },
      },
      FooResource: {
        "x-ms-azure-resource": true,
        allOf: [{ $ref: "#/definitions/Resource" }],
        properties: {
          properties: {
            type: "object",
            $ref: "#/definitions/FooResourceProperties",
          },
        },
      },
      FooResourceProperties: {
        description: "Properties def",
        properties: {
          provisioningState: {
            type: "string",
            enum: ["Creating", "Canceled", "Deleting", "Failed"],
          },
          name: {
            type: "string",
          },
        },
      },
    }
...

## Bad example 3 

Top level property 'location' is specified as a mutable property
```json
    paths: {
      "/foo": {
        patch: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_patch",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "Success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          },
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/Resource",
          },
        ],
      },
      FooProps: {
        properties: {
          name: {
            type: "string",
          },
        },
      },
      Resource: {
        "x-ms-azure-resource": true,
        description: "Test Description",
        properties: {
          id: {
            type: "string",
            readOnly: true,
          },
          name: {
            type: "string",
            readOnly: true,
          },
          type: {
            type: "string",
            readOnly: true,
          },
          location: {
            type: "string",
            "x-ms-mutability": ["read", "update", "create"],
            description: "The geo-location where the resource lives",
          },
        },
      },
      FooResource: {
        "x-ms-azure-resource": true,
        allOf: [{ $ref: "#/definitions/Resource" }],
        properties: {
          provisioningState: {
            type: "string",
            enum: ["Creating", "Canceled", "Deleting", "Failed"],
          },
        },
      },
    },
...


## Good examples

## Good example 1 

Top level properties are specified as readOnly and locaion is specified as immutable. 'properties.provisioningState' is specified as readOnly

```json
    paths: {
      "/foo": {
        patch: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_patch",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "Success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          },
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooResource",
          },
        ],
      },
      FooProps: {
        properties: {
          name: {
            type: "string",
          },
        },
      },
      Resource: {
        "x-ms-azure-resource": true,
        description: "Test Description",
        properties: {
          id: {
            type: "string",
            readOnly: true,
          },
          name: {
            type: "string",
            readOnly: true,
          },
          type: {
            type: "string",
            readOnly: true,
          },
          location: {
            type: "string",
            "x-ms-mutability": ["read", "create"],
            description: "The geo-location where the resource lives",
          },
        },
      },
      FooResource: {
        "x-ms-azure-resource": true,
        allOf: [{ $ref: "#/definitions/Resource" }],
        properties: {
          properties: {
            type: "object",
            $ref: "#/definitions/FooResourceProperties",
          },
        },
      },
      FooResourceProperties: {
        description: "Properties def",
        properties: {
          provisioningState: {
            type: "string",
            enum: ["Creating", "Canceled", "Deleting", "Failed"],
            readOnly: true,
          },
          name: {
            type: "string",
          },
        },
      },
    },
...

