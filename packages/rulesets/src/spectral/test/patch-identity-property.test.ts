import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("PatchIdentityProperty")
  return linter
})

test("PatchIdentityProperty should find errors", () => {
  const oasDoc = {
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
          props: {
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
          identity: {
            $ref: "#/definitions/Identity",
          },
        },
      },
      Identity: {
        description: "Identity for the resource.",
        type: "object",
        properties: {
          principalId: {
            readOnly: true,
            type: "string",
            description: "The principal ID of resource identity.",
          },
          tenantId: {
            readOnly: true,
            type: "string",
            description: "The tenant ID of resource.",
          },
          type: {
            type: "string",
            description: "The identity type.",
            enum: ["SystemAssigned"],
            "x-ms-enum": {
              name: "ResourceIdentityType",
              modelAsString: false,
            },
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
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./foo.patch.parameters.0")
    expect(results[0].message).toContain("The patch operation body parameter schema should contain property 'identity'.")
  })
})

test("PatchIdentityProperty should find no errors", () => {
  const oasDoc = {
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
          identity: {
            $ref: "#/definitions/Identity",
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
          identity: {
            $ref: "#/definitions/Identity",
          },
        },
      },
      Identity: {
        description: "Identity for the resource.",
        type: "object",
        properties: {
          principalId: {
            readOnly: true,
            type: "string",
            description: "The principal ID of resource identity.",
          },
          tenantId: {
            readOnly: true,
            type: "string",
            description: "The tenant ID of resource.",
          },
          type: {
            type: "string",
            description: "The identity type.",
            enum: ["SystemAssigned"],
            "x-ms-enum": {
              name: "ResourceIdentityType",
              modelAsString: false,
            },
          },
        },
      },
      FooResource: {
        "x-ms-azure-resource": true,
        allOf: [{ $ref: "#/definitions/Resource" }],
        properties: {
          props: {
            type: "string",
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
