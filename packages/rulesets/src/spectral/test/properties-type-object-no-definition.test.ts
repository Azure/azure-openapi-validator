import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"
let linter: Spectral
const errorMessageObject =
  "Properties with type:object that don't reference a model definition are not allowed. ARM doesn't allow generic type definitions as this leads to bad customer experience."
const errorMessageNull =
  "Properties with 'type' NULL are not allowed, please specify the 'type' as 'Primitive' or 'Object' referring a model."

beforeAll(async () => {
  linter = await linterForRule("PropertiesTypeObjectNoDefinition")
  return linter
})

test("PropertiesTypeObjectNoDefinition if type:object is undefined should find errors", () => {
  const oasDoc1 = {
    swagger: "2.0",
    info: {
      version: "4.0",
      title: "Common types",
    },
    paths: {},
    definitions: {
      ErrorDetail: {
        description: "The error detail.",
        type: "object",
        properties: {
          details: {
            readOnly: true,
            type: "array",
            items: {
              $ref: "#/definitions/ErrorDetail",
            },
            "x-ms-identifiers": ["message", "target"],
            description: "The error details.",
          },
          additionalInfo: {
            readOnly: true,
            type: "array",
            items: {
              $ref: "#/definitions/ErrorAdditionalInfo",
            },
            "x-ms-identifiers": [],
            description: "The error additional info.",
          },
        },
      },
      ErrorResponse: {
        title: "Error response",
        description:
          "Common error response for all Azure Resource Manager APIs to return error details for failed operations. (This also follows the OData error response format.).",
        type: "object",
        properties: {
          error: {
            description: "The error object.",
            $ref: "#/definitions/ErrorDetail",
          },
        },
      },
      ErrorAdditionalInfo: {
        type: "object",
        properties: {
          type: {
            readOnly: true,
            type: "string",
            description: "The additional info type.",
          },
          info: {
            readOnly: true,
            type: "object",
            description: "The additional info.",
          },
        },
        description: "The resource management error additional info.",
      },
      DeletedUnifiedProtectedItemResource: {
        type: "object",
        description: "A DeletedUnifiedProtectedItem represents a protected item by backup or replication solution of deleted resource.",
        properties: {
          properties: {
            $ref: "#/definitions/UnifiedProtectedItemProperties",
            description: "The resource-specific properties for this resource.",
            "x-ms-client-flatten": true,
            "x-ms-mutability": ["read", "create"],
          },
        },
        allOf: [
          {
            $ref: "#/definitions/ProvisioningState",
          },
        ],
      },
      DeletedUnifiedProtectedItemResourceListResult: {
        type: "object",
        description: "The response of a DeletedUnifiedProtectedItemResource list operation.",
        properties: {
          value: {
            type: "array",
            description: "The DeletedUnifiedProtectedItemResource items on this page",
            items: {
              $ref: "#/definitions/DeletedUnifiedProtectedItemResource",
            },
          },
          nextLink: {
            type: "string",
            format: "uri",
            description: "The link to the next page of items",
            readOnly: true,
          },
        },
        required: ["value"],
      },

      ProvisioningState: {
        type: "string",
        description: "The provisioning state of a resource type.",
        enum: ["Succeeded", "Failed", "Canceled"],
        "x-ms-enum": {
          name: "ProvisioningState",
          modelAsString: true,
          values: [
            {
              name: "Succeeded",
              value: "Succeeded",
              description: "Resource has been created.",
            },
            {
              name: "Failed",
              value: "Failed",
              description: "Resource creation failed.",
            },
            {
              name: "Canceled",
              value: "Canceled",
              description: "Resource creation was canceled.",
            },
          ],
        },
        readOnly: true,
      },
      ProviderSpecificProperties: {
        type: "object",
        description: "Definition of provider specific properties.",
      },
      SolutionSpecificProtectedItem: {
        type: "object",
        description: "Definition of solution specific protected item.",
        properties: {
          providerSpecificProperties: {
            $ref: "#/definitions/ProviderSpecificProperties",
            description: "Provider specific properties.",
          },
        },
      },
      SolutionSpecificProtectionProperties: {
        type: "object",
        description: "Definition of solution specific protected item.",
        properties: {
          allowedOperationsPerSolution: {
            type: "array",
            description: "List of allowed operations.",
            items: {
              type: "string",
            },
          },
        },
        required: ["allowedOperationsPerSolution"],
      },
      UnifiedProtectedItemProperties: {
        type: "object",
        description: "Definition of unified protected item properties.",
        properties: {
          solutionSpecificProtectionProperties: {
            type: "object",
            description: "Dictionary for solution specific properties.",
            additionalProperties: {
              $ref: "#/definitions/SolutionSpecificProtectionProperties",
            },
            readOnly: true,
          },
          protectedItems: {
            type: "array",
            description: "Detail of protected item.",
            items: {
              $ref: "#/definitions/SolutionSpecificProtectedItem",
            },
            readOnly: true,
            "x-ms-identifiers": [],
          },
        },
      },
      UnifiedProtectedItemResource: {
        type: "object",
        description: "A UnifiedProtectedItem represents a protected item by backup or replication solution.",
        properties: {
          $ref: "#/definitions/UnifiedProtectedItemProperties",
          description: "The resource-specific properties for this resource.",
          "x-ms-client-flatten": true,
          "x-ms-mutability": ["read", "create"],
        },
        allOf: [
          {
            $ref: "#/definitions/ProvisioningState",
          },
        ],
      },
    },
  }
  return linter.run(oasDoc1).then((results) => {
    expect(results.length).toBe(9)
    expect(results[0].path.join(".")).toBe(
      "definitions.DeletedUnifiedProtectedItemResource.properties.properties.properties.protectedItems.items.properties.providerSpecificProperties",
    )
    expect(results[1].path.join(".")).toBe(
      "definitions.DeletedUnifiedProtectedItemResourceListResult.properties.value.items.properties.properties.properties.protectedItems.items.properties.providerSpecificProperties",
    )
    expect(results[2].path.join(".")).toBe("definitions.ErrorDetail.properties.additionalInfo.items.properties.info")
    expect(results[3].path.join(".")).toBe("definitions.ErrorResponse.properties.error.properties.additionalInfo.items.properties.info")
    expect(results[4].path.join(".")).toBe(
      "definitions.UnifiedProtectedItemProperties.properties.protectedItems.items.properties.providerSpecificProperties",
    )
    expect(results[5].path.join(".")).toBe(
      "definitions.UnifiedProtectedItemResource.properties.properties.protectedItems.items.properties.providerSpecificProperties",
    )
    expect(results[6].path.join(".")).toBe("definitions.ErrorAdditionalInfo.properties.info")

    expect(results[7].path.join(".")).toBe("definitions.ProviderSpecificProperties")
    expect(results[8].path.join(".")).toBe("definitions.SolutionSpecificProtectedItem.properties.providerSpecificProperties")
    expect(results[0].message).toBe(errorMessageObject)
    expect(results[1].message).toBe(errorMessageObject)
    expect(results[2].message).toBe(errorMessageObject)
    expect(results[3].message).toBe(errorMessageObject)
    expect(results[4].message).toBe(errorMessageObject)
    expect(results[5].message).toBe(errorMessageObject)
    expect(results[6].message).toBe(errorMessageObject)
    expect(results[7].message).toBe(errorMessageObject)
  })
})

test("PropertiesTypeObjectNoDefinition if type is null should find errors", () => {
  const oasDoc1 = {
    swagger: "2.0",
    info: {
      version: "4.0",
      title: "Common types",
    },
    paths: {},
    definitions: {
      ErrorDetail: {
        description: "The error detail.",
        type: "object",
        properties: {
          details: {
            readOnly: true,
            type: "array",
            items: {
              $ref: "#/definitions/ErrorDetail",
            },
            "x-ms-identifiers": ["message", "target"],
            description: "The error details.",
          },
          additionalInfo: {
            readOnly: true,
            type: "array",
            items: {
              $ref: "#/definitions/ErrorAdditionalInfo",
            },
            "x-ms-identifiers": [],
            description: "The error additional info.",
          },
        },
      },
      ErrorResponse: {
        title: "Error response",
        description:
          "Common error response for all Azure Resource Manager APIs to return error details for failed operations. (This also follows the OData error response format.).",
        type: "object",
        properties: {
          error: {
            description: "The error object.",
            $ref: "#/definitions/ErrorDetail",
          },
        },
      },
      ErrorAdditionalInfo: {
        type: "object",
        properties: {
          type: {
            readOnly: true,
            type: "string",
            description: "The additional info type.",
          },
          info: {
            readOnly: true,
            type: "",
            description: "The additional info.",
          },
        },
        description: "The resource management error additional info.",
      },
    },
  }
  return linter.run(oasDoc1).then((results) => {
    expect(results.length).toBe(3)
    expect(results[0].path.join(".")).toBe("definitions.ErrorDetail.properties.additionalInfo.items.properties.info")
    expect(results[1].path.join(".")).toBe("definitions.ErrorResponse.properties.error.properties.additionalInfo.items.properties.info")
    expect(results[2].path.join(".")).toBe("definitions.ErrorAdditionalInfo.properties.info")
    expect(results[0].message).toBe(errorMessageNull)
    expect(results[1].message).toBe(errorMessageNull)
    expect(results[2].message).toBe(errorMessageNull)
  })
})

test("PropertiesTypeObjectNoDefinition should find errors if there are any empty properties", () => {
  const oasDoc1 = {
    swagger: "2.0",
    info: {
      version: "4.0",
      title: "Common types",
    },
    paths: {},
    definitions: {
      ErrorDetail: {
        description: "The error detail.",
        type: "object",
        properties: {},
      },
    },
  }
  return linter.run(oasDoc1).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("definitions.ErrorDetail")
    expect(results[0].message).toBe(errorMessageObject)
  })
})

test("PropertiesTypeObjectNoDefinition should find no errors", () => {
  const oasDoc1 = {
    swagger: "2.0",
    info: {
      version: "4.0",
      title: "Common types",
    },
    paths: {},
    definitions: {
      ErrorDetail: {
        description: "The error detail.",
        type: "object",
        properties: {
          details: {
            readOnly: true,
            type: "array",
            items: {
              $ref: "#/definitions/ErrorDetail",
            },
            "x-ms-identifiers": ["message", "target"],
            description: "The error details.",
          },
          additionalInfo: {
            readOnly: true,
            type: "array",
            items: {
              $ref: "#/definitions/ErrorAdditionalInfo",
            },
            "x-ms-identifiers": [],
            description: "The error additional info.",
          },
        },
      },
      ErrorResponse: {
        title: "Error response",
        description:
          "Common error response for all Azure Resource Manager APIs to return error details for failed operations. (This also follows the OData error response format.).",
        type: "object",
        properties: {
          error: {
            description: "The error object.",
            $ref: "#/definitions/ErrorDetail",
          },
        },
      },
      ErrorAdditionalInfo: {
        type: "object",
        properties: {
          type: {
            readOnly: true,
            type: "string",
            description: "The additional info type.",
          },
          info: {
            readOnly: true,
            type: "string",
            description: "The additional info.",
          },
        },
        description: "The resource management error additional info.",
      },
      ErrorAdditionalProperties: {
        type: "object",
        properties: {
          type: "object",
          additionalProperties: {
            readOnly: true,
            type: "string",
            description: "The additional info.",
          },
        },
        description: "The resource management error additional info.",
      },
      AdditionalProperties: {
        type: "object",
        additionalProperties: {
          readOnly: true,
          type: "string",
          description: "The additional info.",
        },
        description: "The resource management error additional info.",
      },
      PropertiesAndAdditionalProperties: {
        type: "object",
        properties: {
          additionalInfo: {
            readOnly: true,
            type: "array",
            items: {
              $ref: "#/definitions/ErrorAdditionalInfo",
            },
            "x-ms-identifiers": [],
            description: "The error additional info.",
          },
        },
        additionalProperties: {
          readOnly: true,
          type: "array",
          items: {
            type: "string",
          },
          description: "The additional info.",
        },
        description: "The resource management error additional info.",
      },
    },
  }
  return linter.run(oasDoc1).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("PropertiesTypeObjectNoDefinition should find no errors for type allOf", () => {
  const oasDoc1 = {
    swagger: "2.0",
    info: {
      version: "4.0",
      title: "Common types",
    },
    paths: {},
    definitions: {
      ErrorResponse: {
        title: "Error response",
        description:
          "Common error response for all Azure Resource Manager APIs to return error details for failed operations. (This also follows the OData error response format.).",
        type: "object",
        allOf: [
          {
            $ref: "#/definitions/ErrorAdditionalInfo",
          },
        ],
      },
      ErrorAdditionalInfo: {
        type: "object",
        properties: {
          type: {
            readOnly: true,
            type: "string",
            description: "The additional info type.",
          },
          info: {
            readOnly: true,
            type: "string",
            description: "The additional info.",
          },
        },
        description: "The resource management error additional info.",
      },
    },
  }
  return linter.run(oasDoc1).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("PropertiesTypeObjectNoDefinition should find errors when type:object is not defined", () => {
  const oasDoc = {
    swagger: "2.0",
    info: {
      version: "4.0",
      title: "Common types",
    },
    paths: {},
    definitions: {
      VirtualMachineScaleSetExtension: {
        properties: {
          name: {
            type: "string",
            description: "The name of the extension.",
          },
          type: {
            readOnly: true,
            type: "string",
            description: "Resource type",
          },
          properties: {
            "x-ms-client-flatten": true,
            $ref: "#/definitions/VirtualMachineScaleSetExtensionProperties",
          },
        },
        description: "Describes a Virtual Machine Scale Set Extension.",
      },
      VirtualMachineScaleSetExtensionListResult: {
        properties: {
          value: {
            type: "array",
            items: {
              $ref: "#/definitions/VirtualMachineScaleSetExtension",
            },
            description: "The list of VM scale set extensions.",
          },
          nextLink: {
            type: "string",
            description:
              "The uri to fetch the next page of VM scale set extensions. Call ListNext() with this to fetch the next page of VM scale set extensions.",
          },
        },
        required: ["value"],
        description: "The List VM scale set extension operation response.",
      },
      VirtualMachineScaleSetExtensionProperties: {
        properties: {
          settings: {
            type: "object",
            description: "Json formatted public settings for the extension.",
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3)
    expect(results[0].path.join(".")).toBe("definitions.VirtualMachineScaleSetExtension.properties.properties.properties.settings"),
    expect(results[0].message).toBe(errorMessageObject),
    expect(results[1].path.join(".")).toBe("definitions.VirtualMachineScaleSetExtensionListResult.properties.value.items.properties.properties.properties.settings"),
    expect(results[1].message).toBe(errorMessageObject),
    expect(results[2].path.join(".")).toBe("definitions.VirtualMachineScaleSetExtensionProperties.properties.settings"),
    expect(results[2].message).toBe(errorMessageObject)
  })
})
