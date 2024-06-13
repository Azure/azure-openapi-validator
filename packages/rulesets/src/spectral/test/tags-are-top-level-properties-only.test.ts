import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral
const errorMessage = "Tags must be defined as a top-level property, not in the properties bag."
beforeAll(async () => {
  linter = await linterForRule("TagsAreTopLevelPropertiesOnly")
  return linter
})

test("TagsAreTopLevelPropertiesOnly should find errors", () => {
  const oasDoc = {
    swagger: "2.0",
    definitions: {
      tags: {
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
      That: {
        description: "That",
        type: "object",
        properties: {
          nonTags: {
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
      ThaOther: {
        description: "ThaOther",
        type: "object",
        properties: {
          tags: {
            type: "object",
            info: {
              type: "String",
            },
          },
          additionalProperties: {
            type: "object",
            params: {
              type: "boolean",
            },
          },
        },
      },
      Other: {
        description: "Other object",
        type: "object",
        properties: {
          type: "object",
          additionalProperties: {
            type: "string",
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
            nonTags: {
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
      },
      ActionGroupPatchBody: {
        description: "A tenant action group object for the body of patch operations.",
        type: "object",
        properties: {
          tags: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "Resource tags",
          },
          identity: {
            $ref: "#/definitions/ManagedServiceIdentity",
          },
        },
      },
      UserAssignedIdentitiy: {
        title: "User-Assigned Identities",
        description:
          "The set of user assigned identities associated with the resource. The userAssignedIdentities dictionary keys will be ARM resource ids in the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}. The dictionary values can be empty objects ({}) in requests.",
        type: "object",
        additionalProperties: {
          "x-nullable": true,
        },
      },
      ManagedServiceIdentity: {
        description: "Managed service identity (system assigned and/or user assigned identities)",
        type: "object",
        properties: {
          principalId: {
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
          type: {
            $ref: "src/spectral/test/resources/lro-provisioning-state-specified.json#/definitions/PrivateEndpointConnection",
          },
        },
        required: ["type"],
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(4)
    expect(results[0].path.join(".")).toBe("definitions.tags.properties.tags")
    expect(results[1].path.join(".")).toBe("definitions.ThaOther.properties.tags")
    expect(results[2].path.join(".")).toBe("definitions.ThisOther.properties.tags")
    expect(results[3].path.join(".")).toBe("definitions.ActionGroupPatchBody.properties.tags")
    expect(results[0].message).toBe(errorMessage)
    expect(results[1].message).toBe(errorMessage)
    expect(results[2].message).toBe(errorMessage)
    expect(results[3].message).toBe(errorMessage)
  })
})

test("TagsAreTopLevelPropertiesOnly should find no errors", () => {
  const oasDoc1 = {
    swagger: "2.0",
    definitions: {
      type: "object",
      source: {
        type: "string",
      },
      // top level property
      tags: {
        type: "object",
        additionalProperties: {
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
          principalId: {
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
          type: {
            $ref: "src/spectral/test/resources/lro-provisioning-state-specified.json#/definitions/ManagedServiceIdentityWithDelegation",
          },
        },
        required: ["type"],
      },
    },
  }
  return linter.run(oasDoc1).then((results) => {
    expect(results.length).toBe(0)
  })
})
