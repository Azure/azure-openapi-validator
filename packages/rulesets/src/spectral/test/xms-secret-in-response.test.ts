import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

const ERROR_MESSAGE = `Property '{prpName}' contains secret keyword and does not have 'x-ms-secret' annotation. To ensure security, must add the 'x-ms-secret' annotation to this property.`
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
        get: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_get",
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
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_post",
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
          value: {
            type: "string",
          },
        },
      },
      Foo: {
        "x-ms-azure-resource": true,
        properties: {
          somecredential: {
            type: "string",
          },
          somesecret: {
            type: "string",
          },
        },
      },
      FooResource: {
        "x-ms-azure-resource": true,
        properties: {
          somepassword: {
            type: "string",
          },
          sometoken: {
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
          someaccess: {
            type: "string",
          },
          someconnection: {
            type: "string",
          },
        },
        required: ["properties"],
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(18)
    expect(results[0].message).toBe(ERROR_MESSAGE.replace("{prpName}", "somepassword"))
    expect(results[0].path.join(".")).toBe("paths./foo.get.responses.200.schema.properties.properties.properties.somepassword")
    expect(results[1].message).toBe(ERROR_MESSAGE.replace("{prpName}", "sometoken"))
    expect(results[1].path.join(".")).toBe("paths./foo.get.responses.200.schema.properties.properties.properties.sometoken")
    expect(results[2].message).toBe(ERROR_MESSAGE.replace("{prpName}", "someaccess"))
    expect(results[2].path.join(".")).toBe("paths./foo.get.responses.200.schema.properties.someaccess")
    expect(results[3].message).toBe(ERROR_MESSAGE.replace("{prpName}", "someconnection"))
    expect(results[3].path.join(".")).toBe("paths./foo.get.responses.200.schema.properties.someconnection")
    expect(results[4].message).toBe(ERROR_MESSAGE.replace("{prpName}", "somecredential"))
    expect(results[4].path.join(".")).toBe("paths./foo.get.responses.201.schema.properties.properties.properties.somecredential")
    expect(results[5].message).toBe(ERROR_MESSAGE.replace("{prpName}", "somesecret"))
    expect(results[5].path.join(".")).toBe("paths./foo.get.responses.201.schema.properties.properties.properties.somesecret")
    expect(results[6].message).toBe(ERROR_MESSAGE.replace("{prpName}", "somepassword"))
    expect(results[6].path.join(".")).toBe("paths./foo.post.responses.200.schema.properties.properties.properties.somepassword")
    expect(results[7].message).toBe(ERROR_MESSAGE.replace("{prpName}", "sometoken"))
    expect(results[7].path.join(".")).toBe("paths./foo.post.responses.200.schema.properties.properties.properties.sometoken")
    expect(results[8].message).toBe(ERROR_MESSAGE.replace("{prpName}", "someaccess"))
    expect(results[8].path.join(".")).toBe("paths./foo.post.responses.200.schema.properties.someaccess")
    expect(results[9].message).toBe(ERROR_MESSAGE.replace("{prpName}", "someconnection"))
    expect(results[9].path.join(".")).toBe("paths./foo.post.responses.200.schema.properties.someconnection")
    expect(results[10].message).toBe(ERROR_MESSAGE.replace("{prpName}", "somecredential"))
    expect(results[10].path.join(".")).toBe("paths./foo.post.responses.201.schema.properties.properties.properties.somecredential")
    expect(results[11].message).toBe(ERROR_MESSAGE.replace("{prpName}", "somesecret"))
    expect(results[11].path.join(".")).toBe("paths./foo.post.responses.201.schema.properties.properties.properties.somesecret")
    expect(results[12].message).toBe(ERROR_MESSAGE.replace("{prpName}", "somepassword"))
    expect(results[12].path.join(".")).toBe("paths./foo.put.responses.200.schema.properties.properties.properties.somepassword")
    expect(results[13].message).toBe(ERROR_MESSAGE.replace("{prpName}", "sometoken"))
    expect(results[13].path.join(".")).toBe("paths./foo.put.responses.200.schema.properties.properties.properties.sometoken")
    expect(results[14].message).toBe(ERROR_MESSAGE.replace("{prpName}", "someaccess"))
    expect(results[14].path.join(".")).toBe("paths./foo.put.responses.200.schema.properties.someaccess")
    expect(results[15].message).toBe(ERROR_MESSAGE.replace("{prpName}", "someconnection"))
    expect(results[15].path.join(".")).toBe("paths./foo.put.responses.200.schema.properties.someconnection")
    expect(results[16].message).toBe(ERROR_MESSAGE.replace("{prpName}", "somecredential"))
    expect(results[16].path.join(".")).toBe("paths./foo.put.responses.201.schema.properties.properties.properties.somecredential")
    expect(results[17].message).toBe(ERROR_MESSAGE.replace("{prpName}", "somesecret"))
    expect(results[17].path.join(".")).toBe("paths./foo.put.responses.201.schema.properties.properties.properties.somesecret")
  })
})

test("XMSSecretInResponse should find no errors with newly added typespec conditions", () => {
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
          value: {
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
          access: {
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
    expect(results.length).toBe(0)
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
        get: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_get",
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
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_post",
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
          value: {
            type: "string",
          },
          password: {
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
          properties: {
            $ref: "#/definitions/FooKeyValuePair",
            "x-ms-client-flatten": true,
          },
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
      FooKeyValuePair: {
        "x-ms-azure-resource": true,
        properties: {
          key: {
            type: "string",
          },
          value: {
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
            "x-ms-secret": true,
          },
          connection: {
            type: "string",
            "x-ms-secret": true,
          },
          booleanaccess: {
            type: "boolean",
          },
          enumtoken: {
            type: "enum",
            enum: ["value1", "value2", "value3"],
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
