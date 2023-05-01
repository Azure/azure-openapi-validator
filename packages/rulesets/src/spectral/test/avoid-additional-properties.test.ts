import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("AvoidAdditionalProperties")
  return linter
})

test("AvoidAdditionalProperties should find errors", () => {
  const oasDoc = {
    swagger: "2.0",
    definitions: {
      This: {
        description: "This",
        type: "object",
        properties: {
          type: "object",
          tags: {
            type: "string",
          },
        },
        additionalProperties: {
          type: "string",
        },
      },
      That: {
        description: "That",
        type: "object",
        properties: {
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
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(4)
  })
})

test("AvoidAdditionalProperties should find no errors", () => {
  const oasDoc = {
    swagger: "2.0",
    definitions: {
      This: {
        description: "This",
        type: "object",
        properties: {
          type: "object",
          tags: {
            type: "object",
          },
        },
      },
      That: {
        description: "That",
        type: "object",
        properties: {
          tags: {
            type: "object",
          },
          params: {
            type: "boolean",
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
        },
      },
      Other: {
        description: "Other object",
        type: "object",
        properties: {
          type: "string",
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
