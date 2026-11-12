import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

const ERROR_MESSAGE = `Property '{prpName}' contains secret keyword and does not have 'x-ms-secret' annotation. To ensure security, must add the 'x-ms-secret' annotation to this property.`

beforeAll(async () => {
  linter = await linterForRule("XMSSecretInResponse")
  return linter
})

test.each(["password", "PASSWORD", "PassWord", "passphrase", "PASSPHRASE", "PassPhrase", "clusterPeeringPassphrase", "clusterPEERINGPASSPHRASE"])(
  "XMSSecretInResponse detects and accepts an annotation on %s",
  async (propertyName) => {
    const property: { type: string; "x-ms-secret"?: boolean } = { type: "string" }
    const oasDoc = {
      swagger: "2.0",
      info: { title: "Credentials", version: "1.0" },
      paths: {},
      definitions: {
        Credentials: {
          type: "object",
          properties: { [propertyName]: property },
        },
      },
    }

    const results = await linter.run(oasDoc)
    expect(results).toHaveLength(1)
    expect(results[0].path).toEqual(["definitions", "Credentials", "properties", propertyName])
    expect(results[0].message).toBe(ERROR_MESSAGE.replace("{prpName}", propertyName))
    expect(results[0].severity).toBe(0)

    property["x-ms-secret"] = true
    expect(await linter.run(oasDoc)).toHaveLength(0)
  },
)

test("XMSSecretInResponse preserves exclusions and existing sensitive suffix boundaries", async () => {
  const oasDoc = {
    swagger: "2.0",
    info: { title: "Credentials", version: "1.0" },
    paths: {},
    definitions: {
      Credentials: {
        type: "object",
        properties: {
          passwordHash: { type: "string" },
          passwordPolicy: { type: "string" },
          passphraseHint: { type: "string" },
          publicPassword: { type: "string" },
          publicPassphrase: { type: "string" },
          passwordEnum: { type: "string" },
          password: { type: "string", enum: ["one", "two"] },
          passphrase: { type: "string", "x-ms-enum": { name: "Passphrase", modelAsString: true } },
          clusterPeeringPassphrase: { type: "integer" },
          anotherPassphrase: { type: "string", "x-ms-secret": true },
          credential: { type: "string" },
          token: { type: "string" },
          secret: { type: "string" },
          key: { type: "string", description: "A password or passphrase" },
          value: { type: "string" },
          tokenRefreshToken: { type: "string" },
          accountPassword: { type: "string" },
          accessToken: { type: "string" },
        },
      },
      DictionaryEntry: {
        type: "object",
        properties: {
          key: { type: "string" },
          value: { type: "string" },
        },
      },
    },
  }

  const results = await linter.run(oasDoc)
  expect(results.map((result) => result.path.join("."))).toEqual(
    expect.arrayContaining(["definitions.Credentials.properties.accountPassword", "definitions.Credentials.properties.accessToken"]),
  )
  expect(results).toHaveLength(2)
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
    expect(results.length).toBe(10)
    const errorPaths = results.map((r) => r.path.join("."))
    expect(errorPaths).toContain("definitions.FooResource.properties.somepassword")
    expect(errorPaths).toContain("definitions.FooResource.properties.sometoken")
    expect(errorPaths).toContain("definitions.Foo.properties.somecredential")
    expect(errorPaths).toContain("definitions.Foo.properties.somesecret")
    expect(errorPaths).toContain("definitions.FooRule.properties.someaccess")
    expect(errorPaths).toContain("definitions.FooRule.properties.someconnection")
    expect(errorPaths).toContain("definitions.FooDefinition.properties.properties.properties.somecredential")
    expect(errorPaths).toContain("definitions.FooDefinition.properties.properties.properties.somesecret")
    expect(errorPaths).toContain("definitions.FooRule.properties.properties.properties.somepassword")
    expect(errorPaths).toContain("definitions.FooRule.properties.properties.properties.sometoken")

    // Verify error messages
    results.forEach((result) => {
      const propertyName = String(result.path[result.path.length - 1])
      const expectedMessage = ERROR_MESSAGE.replace("{prpName}", propertyName)
      expect(result.message).toBe(expectedMessage)
    })
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
          // Test that properties with "public" in name are not flagged
          publicNetworkAccess: {
            type: "string",
            description: "State of public network access.",
            enum: ["Enabled", "Disabled"],
            "x-ms-enum": {
              name: "PublicNetworkAccess",
              modelAsString: true,
            },
          },
          publicKey: {
            type: "string",
            description: "The public key for authentication.",
          },
          isPublicConnection: {
            type: "string",
            description: "Indicates if connection is public.",
          },
          // Test that enum properties (without x-ms-enum) are not flagged
          networkAccessEnum: {
            type: "string",
            description: "Network access configuration.",
            enum: ["Allow", "Deny"],
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
