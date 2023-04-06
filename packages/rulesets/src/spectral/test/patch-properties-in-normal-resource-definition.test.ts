import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("PatchPropertiesInNormalResourceDefinition")
  return linter
})

const ERROR_MESSAGE =
  "Patch request body MUST contain at least one or more properties present in the normal resource definition (PUT operation)"

test("PatchPropertiesInNormalResourceDefinition should find errors if none of the patch properties are in put", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
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
              description: "success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          },
        },
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_put",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooProps",
              },
            },
            "201": {
              description: "newly created",
              schema: {
                $ref: "#/definitions/FooRequestParams",
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
      FooResource: {
        "x-ms-azure-resource": true,
        properties: {
          provisioningState: {
            type: "string",
            description: "Provisioning state of the foo rule.",
            enum: ["Creating", "Canceled", "Deleting", "Failed"],
          },
        },
      },
      FooProps: {
        properties: {
          servicePrecedence: {
            description:
              "A precedence value that is used to decide between services when identifying the QoS values to use for a particular SIM. A lower value means a higher priority. This value should be unique among all services configured in the mobile network.",
            type: "integer",
            format: "int32",
            minimum: 0,
            maximum: 255,
          },
          id: {
            type: "string",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toContain(ERROR_MESSAGE)
    expect(results[0].path.join(".")).toBe("paths./foo")
  })
})

test("PatchPropertiesInNormalResourceDefinition should find errors if put is not defined", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
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
              description: "success",
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
      FooResource: {
        "x-ms-azure-resource": true,
        properties: {
          provisioningState: {
            type: "string",
            description: "Provisioning state of the foo rule.",
            enum: ["Creating", "Canceled", "Deleting", "Failed"],
          },
        },
      },
      FooProps: {
        properties: {
          servicePrecedence: {
            description:
              "A precedence value that is used to decide between services when identifying the QoS values to use for a particular SIM. A lower value means a higher priority. This value should be unique among all services configured in the mobile network.",
            type: "integer",
            format: "int32",
            minimum: 0,
            maximum: 255,
          },
          id: {
            type: "string",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toContain(ERROR_MESSAGE)
    expect(results[0].path.join(".")).toBe("paths./foo")
  })
})

test("PatchPropertiesInNormalResourceDefinition should not find errors if patch does not have properties", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
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
              description: "success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          },
        },
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_put",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooProps",
              },
            },
            "201": {
              description: "newly created",
              schema: {
                $ref: "#/definitions/FooRequestParams",
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
      FooResource: {
        "x-ms-azure-resource": true,
      },
      FooProps: {
        properties: {
          servicePrecedence: {
            description:
              "A precedence value that is used to decide between services when identifying the QoS values to use for a particular SIM. A lower value means a higher priority. This value should be unique among all services configured in the mobile network.",
            type: "integer",
            format: "int32",
            minimum: 0,
            maximum: 255,
          },
          id: {
            type: "string",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("PatchPropertiesInNormalResourceDefinition should find errors if patch has properties and put does not have properties", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
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
              description: "success",
              schema: {
                $ref: "#/definitions/FooProps",
              },
            },
          },
        },
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_put",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
            "201": {
              description: "newly created",
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
      FooResource: {
        "x-ms-azure-resource": true,
      },
      FooProps: {
        properties: {
          servicePrecedence: {
            description:
              "A precedence value that is used to decide between services when identifying the QoS values to use for a particular SIM. A lower value means a higher priority. This value should be unique among all services configured in the mobile network.",
            type: "integer",
            format: "int32",
            minimum: 0,
            maximum: 255,
          },
          id: {
            type: "string",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toContain(ERROR_MESSAGE)
    expect(results[0].path.join(".")).toBe("paths./foo")
  })
})

test("PatchPropertiesInNormalResourceDefinition should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
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
              description: "success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          },
        },
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_put",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
            "201": {
              description: "newly created",
              schema: {
                $ref: "#/definitions/FooProps",
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
      FooResource: {
        "x-ms-azure-resource": true,
        properties: {
          provisioningState: {
            type: "string",
            description: "Provisioning state of the foo rule.",
            enum: ["Creating", "Canceled", "Deleting", "Failed"],
          },
        },
      },
      FooProps: {
        properties: {
          servicePrecedence: {
            description:
              "A precedence value that is used to decide between services when identifying the QoS values to use for a particular SIM. A lower value means a higher priority. This value should be unique among all services configured in the mobile network.",
            type: "integer",
            format: "int32",
            minimum: 0,
            maximum: 255,
          },
          id: {
            type: "string",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
