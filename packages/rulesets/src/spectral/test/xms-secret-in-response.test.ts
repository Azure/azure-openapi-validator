import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

const ERROR_MESSAGE = `contains secret keyword and does not have 'x-ms-secret' annotation. To ensure security, must add the 'x-ms-secret' annotation to this property.`
beforeAll(async () => {
  linter = await linterForRule("XMSSecretInResponse")
  return linter
})

test("XMSSecretInResponse should find errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/foo": {
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
              description: "Success",
              schema: {
                $ref: "#/definitions/FooRule",
              },
            },
            "201": {
              description: "Success",
              schema: {
                $ref: "#/definitions/FooDefinition",
              },
            },
          },
          "x-ms-long-running-operation": true,
          "x-ms-long-running-operation-options": {
            "final-state-via": "azure-async-operation",
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
      FooDefinition: {
        "x-ms-azure-resource": true,
        properties: {
          properties: {
            $ref: "#/definitions/Foo",
            "x-ms-client-flatten": true,
          },
          key: {
            type: "string",
          },
        },
      },
      Foo: {
        "x-ms-azure-resource": true,
        properties: {
          credentials: {
            type: "string",
          },
          secret: {
            type: "string",
          },
        },
      },
      FooResource: {
        "x-ms-azure-resource": true,
        properties: {
          password: {
            type: "string",
            "x-ms-secret": true,
          },
          token: {
            type: "string",
          },
        },
      },
      FooRule: {
        type: "object",
        properties: {
          properties: {
            $ref: "#/definitions/FooResource",
            "x-ms-client-flatten": true,
          },
          accessKey: {
            type: "string",
          },
          connection: {
            type: "string",
          },
        },
        required: ["properties"],
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(6)
    expect(results[0].message).toContain(ERROR_MESSAGE)
    expect(results[0].path.join(".")).toBe("paths./foo.put.responses.200.schema.properties")
    expect(results[1].message).toContain(ERROR_MESSAGE)
    expect(results[1].path.join(".")).toBe("paths./foo.put.responses.200.schema.properties")
    expect(results[2].message).toContain(ERROR_MESSAGE)
    expect(results[2].path.join(".")).toBe("paths./foo.put.responses.200.schema.properties.properties.properties")
    expect(results[3].message).toContain(ERROR_MESSAGE)
    expect(results[3].path.join(".")).toBe("paths./foo.put.responses.201.schema.properties")
    expect(results[4].message).toContain(ERROR_MESSAGE)
    expect(results[4].path.join(".")).toBe("paths./foo.put.responses.201.schema.properties.properties.properties")
    expect(results[5].message).toContain(ERROR_MESSAGE)
    expect(results[5].path.join(".")).toBe("paths./foo.put.responses.201.schema.properties.properties.properties")
  })
})

test("XMSSecretInResponse should find no errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/foo": {
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
              description: "Success",
              schema: {
                $ref: "#/definitions/FooRule",
              },
            },
            "201": {
              description: "Success",
              schema: {
                $ref: "#/definitions/FooDefinition",
              },
            },
          },
          "x-ms-long-running-operation": true,
          "x-ms-long-running-operation-options": {
            "final-state-via": "azure-async-operation",
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
      FooDefinition: {
        "x-ms-azure-resource": true,
        properties: {
          properties: {
            $ref: "#/definitions/Foo",
            "x-ms-client-flatten": true,
          },
          key: {
            type: "string",
            "x-ms-secret": true,
          },
        },
      },
      Foo: {
        "x-ms-azure-resource": true,
        properties: {
          credentials: {
            type: "string",
            "x-ms-secret": true,
          },
          secret: {
            type: "string",
            "x-ms-secret": true,
          },
        },
      },
      FooResource: {
        "x-ms-azure-resource": true,
        properties: {
          password: {
            type: "string",
            "x-ms-secret": true,
          },
          token: {
            type: "string",
            "x-ms-secret": true,
          },
        },
      },
      FooRule: {
        type: "object",
        properties: {
          properties: {
            $ref: "#/definitions/FooResource",
            "x-ms-client-flatten": true,
          },
          accessKey: {
            type: "string",
            "x-ms-secret": true,
          },
          connection: {
            type: "string",
            "x-ms-secret": true,
          },
        },
        required: ["properties"],
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
