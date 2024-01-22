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
    },
  }
  return linter.run(oasDoc1).then((results) => {
    expect(results.length).toBe(3)
    expect(results[0].path.join(".")).toBe("definitions.ErrorDetail.properties.additionalInfo.items.properties.info")
    expect(results[1].path.join(".")).toBe("definitions.ErrorResponse.properties.error.properties.additionalInfo.items.properties.info")
    expect(results[2].path.join(".")).toBe("definitions.ErrorAdditionalInfo.properties.info")
    expect(results[0].message).toBe(errorMessageObject)
    expect(results[1].message).toBe(errorMessageObject)
    expect(results[2].message).toBe(errorMessageObject)
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
