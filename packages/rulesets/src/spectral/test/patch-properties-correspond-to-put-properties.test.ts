import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("PatchPropertiesCorrespondToPutProperties")
  return linter
})

test("PatchPropertiesCorrespondToPutProperties should find errors if the patch body parameters are not in the put body", () => {
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
                $ref: "#/definitions/FooProps",
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
                $ref: "#/definitions/FooResource",
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
      BarRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/BarProps",
          },
        ],
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
      BarProps: {
        properties: {
          id: {
            type: "string",
          },
        },
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
    },
  }
  return linter.run(myOpenApiDocument).then((res) => {
    expect(res.length).toBe(2)
    expect(res[0].message).toContain(
      "A patch request body must only contain properties present in the corresponding put request body, and must contain at least one of the properties."
    )
    expect(res[0].path.join(".")).toBe("paths./foo.patch.parameters")
    expect(res[1].message).toContain(
      "A patch request body must only contain properties present in the corresponding put request body, and must contain at least one of the properties."
    )
    expect(res[1].path.join(".")).toBe("paths./foo.patch.parameters")
  })
})

test("PatchPropertiesCorrespondToPutProperties should find errors if the patch body parameters are not in the put body with multiple body params", () => {
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
                $ref: "#/definitions/BarRequestParams",
              },
            },
            {
              name: "foo1_patch",
              in: "body",
              schema: {
                $ref: "#/definitions/FooProps",
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
                $ref: "#/definitions/FooProps",
              },
            },
            {
              name: "foo1_put",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
            {
              name: "foo2_put",
              in: "body",
              schema: {
                $ref: "#/definitions/FooResource",
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
      BarRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/BarProps",
          },
        ],
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
      BarProps: {
        properties: {
          id: {
            type: "string",
          },
        },
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
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toContain(
      "A patch request body must only contain properties present in the corresponding put request body, and must contain at least one of the properties."
    )
    expect(results[0].path.join(".")).toBe("paths./foo.patch.parameters")
  })
})

test("PatchPropertiesCorrespondToPutProperties should find errors if patch body is not defined", () => {
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
              in: "path",
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
                $ref: "#/definitions/FooResource",
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
    expect(results[0].message).toContain("Patch operations body cannot be empty.")
    expect(results[0].path.join(".")).toBe("paths./foo.patch.parameters")
  })
})

test("PatchPropertiesCorrespondToPutProperties should find errors if patch has properties and put body is not defined", () => {
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
              in: "path",
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
    expect(results[0].message).toContain("Non empty patch body with an empty put body is not valid")
    expect(results[0].path.join(".")).toBe("paths./foo.patch.parameters")
  })
})

test("PatchPropertiesCorrespondToPutProperties should find no errors when patch has only put properties", () => {
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
                $ref: "#/definitions/BarRequestParams",
              },
            },
            {
              name: "foo1_patch",
              in: "body",
              schema: {
                $ref: "#/definitions/FooProps",
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
                $ref: "#/definitions/FooProps",
              },
            },
            {
              name: "foo1_put",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
            {
              name: "foo2_put",
              in: "body",
              schema: {
                $ref: "#/definitions/BarRequestParams",
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
      BarRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/BarProps",
          },
        ],
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
      BarProps: {
        properties: {
          id: {
            type: "string",
          },
        },
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
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
