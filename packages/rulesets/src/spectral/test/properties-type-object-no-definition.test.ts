import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral
const errorMessage =
  "If Properties with type:object dont have a reference model defined, then the allowed types can only be primitive data types."
beforeAll(async () => {
  linter = await linterForRule("PropertiesTypeObjectNoDefinition")
  return linter
})
test("PropertiesTypeObjectNoDefinition should find errors", () => {
  const oasDoc = {
    swagger: "2.0",
    definitions: {
      This: {
        description: "This",
        type: "object",
        additionalProperties: {
          type: "",
        },
        tags: {
          type: "object",
          additionalProperties: {
            type: "object",
            info: {
              type: "string",
            },
          },
        },
        properties: {
          type: "object",
        },
      },
      That: {
        description: "That",
        type: "object",
        properties: {
          type: "object",
          params: {
            type: "object",
          },
        },
      },
      ThaOther: {
        description: "ThaOther",
        type: "object",
        properties: {
          type: "object",
          params: {
            type: "string",
          },
        },
        params: {
          type: "object",
        },
      },
      Other: {
        description: "Other",
        type: "object",
        properties: {
          type: "object",
          params: {
            type: "object",
            params: {
              type: "object",
            },
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(5)
    expect(results[0].path.join(".")).toBe("definitions.This.additionalProperties")
    expect(results[1].path.join(".")).toBe("definitions.This.properties")
    expect(results[2].path.join(".")).toBe("definitions.That.properties.params")
    expect(results[3].path.join(".")).toBe("definitions.ThaOther.params")
    expect(results[4].path.join(".")).toBe("definitions.Other.properties.params.params")
    expect(results[0].message).toBe(errorMessage)
    expect(results[1].message).toBe(errorMessage)
    expect(results[2].message).toBe(errorMessage)
    expect(results[3].message).toBe(errorMessage)
    expect(results[4].message).toBe(errorMessage)
  })
})
test("PropertiesTypeObjectNoDefinition should find no errors", () => {
  const oasDoc = {
    swagger: "2.0",
    definitions: {
      This: {
        description: "This",
        type: "object",
        properties: {
          type: "string",
        },
      },
      That: {
        description: "That",
        type: "object",
        properties: {
          type: "object",
          params: {
            type: "boolean",
          },
        },
      },
      ThaOther: {
        description: "ThaOther",
        type: "object",
        properties: {
          type: "object",
          info: {
            type: "string",
            description: "ThaOther",
            readOnly: true,
          },
        },
        params: {
          type: "string",
        },
        ErrorAdditionalInfo: {
          type: "object",
          properties: {
            type: {
              readOnly: true,
              type: "string",
              description: "The additional info type.",
            },
          },
          description: "The resource management error additional info.",
        },
        ErrorAdditionalInfo1: {
          type: "object",
          properties: {
            type: "object",
            properties: {
              readOnly: true,
              type: "string",
              description: "The additional info type.",
            },
            info1: {
              readOnly: true,
              type: "string",
            },
          },
          description: "The resource management error additional info.",
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
