import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral
const errorMessage = "Tags should not be specified in the properties bag for proxy resources. Consider using a Tracked resource instead."
beforeAll(async () => {
  linter = await linterForRule("TagsAreNotAllowedForProxyResources")
  return linter
})

test("TagsAreNotAllowedForProxyResources should find errors", () => {
  const oasDoc = {
    swagger: "2.0",
    definitions: {
      Resources: {
        description: "This",
        type: "object",
        properties: {
          type: "object",
          tags: {
            type: "object",
            additionalProperties: {
              type: "object",
              params: {
                type: "boolean",
              },
            },
          },
        },
      },
      ResourceIdentity: {
        description: "That",
        type: "object",
        properties: {
          type: "object",
          properties: {
            type: "object",
            tags: {
              type: "object",
              additionalProperties: {
                type: "string",
              },
              description: "Resource tags",
            },
            location: {
              type: "string",
            },
          },
        },
      },
      ThisOther: {
        description: "This",
        type: "object",
        properties: {
          type: "object",
          tags: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "Resource tags",
          },
        },
      },
      ActionGroupPatchBody: {
        description: "A tenant action group object for the body of patch operations.",
        type: "object",
        properties: {
          type: "object",
          properties: {
            type: "object",
            // nested tags
            tags: {
              type: "string",
            },
          },
        },
      },
      ManagedServiceIdentity: {
        description: "Managed service identity (system assigned and/or user assigned identities)",
        type: "object",
        properties: {
          tags: {
            readOnly: true,
            format: "uuid",
            type: "string",
            description:
              "The service principal ID of the system assigned identity. This property will only be provided for a system assigned identity.",
          },
          tenantId: {
            readOnly: true,
            format: "uuid",
            type: "string",
            description:
              "The tenant ID of the system assigned identity. This property will only be provided for a system assigned identity.",
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(5)
    expect(results[0].path.join(".")).toBe("definitions.Resources.properties.tags")
    expect(results[1].path.join(".")).toBe("definitions.ResourceIdentity.properties.properties.tags")
    expect(results[2].path.join(".")).toBe("definitions.ThisOther.properties.tags")
    expect(results[3].path.join(".")).toBe("definitions.ActionGroupPatchBody.properties.properties.tags")
    expect(results[4].path.join(".")).toBe("definitions.ManagedServiceIdentity.properties.tags")
    expect(results[0].message).toBe(errorMessage)
    expect(results[1].message).toBe(errorMessage)
    expect(results[2].message).toBe(errorMessage)
    expect(results[3].message).toBe(errorMessage)
    expect(results[4].message).toBe(errorMessage)
  })
})

test("TagsAreNotAllowedForProxyResources should find no errors", () => {
  const oasDoc1 = {
    swagger: "2.0",
    definitions: {
      type: "object",
      source: {
        type: "string",
      },
      properties: {
        type: "object",
        noTags: {
          type: "object",
          params: {
            type: "boolean",
          },
        },
      },
      ManagedServiceIdentity: {
        description: "Managed service identity (system assigned and/or user assigned identities)",
        type: "object",
        properties: {
          tags: {
            readOnly: true,
            format: "uuid",
            type: "string",
            description:
              "The service principal ID of the system assigned identity. This property will only be provided for a system assigned identity.",
          },
          location: {
            readOnly: true,
            format: "uuid",
            type: "string",
            description:
              "The tenant ID of the system assigned identity. This property will only be provided for a system assigned identity.",
          },
        },
      },
    },
  }
  return linter.run(oasDoc1).then((results) => {
    expect(results.length).toBe(0)
  })
})
