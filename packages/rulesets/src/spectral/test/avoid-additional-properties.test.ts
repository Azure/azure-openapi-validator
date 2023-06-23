import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral
const errorMessage = "The use of additionalProperties is not allowed except for user defined tags on tracked resources."
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
            type: "object",
            additionalProperties: {
              type: "object",
              params: {
                type: "boolean",
              },
            },
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
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(5)
    expect(results[0].path.join(".")).toBe("definitions.This")
    expect(results[1].path.join(".")).toBe("definitions.That.properties.nonTags")
    expect(results[2].path.join(".")).toBe("definitions.ThaOther.properties")
    expect(results[3].path.join(".")).toBe("definitions.Other.properties")
    expect(results[4].path.join(".")).toBe("definitions.ThisOther.properties.tags.nonTags")
    expect(results[0].message).toBe(errorMessage)
    expect(results[1].message).toBe(errorMessage)
    expect(results[2].message).toBe(errorMessage)
    expect(results[3].message).toBe(errorMessage)
    expect(results[4].message).toBe(errorMessage)
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
          tags: {
            type: "object",
            additionalProperties: {
              type: "boolean",
            },
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
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("AvoidAdditionalProperties similar to swagger should find no errors", () => {
  const oasDoc1 = {
    swagger: "2.0",
    definitions: {
      type: "object",
      source: {
        type: "object",
        properties: {
          type: "object",
          x: {
            type: "object",
            $ref: "#/definitions/info",
          },
        },
      },
      info: {
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
  }
  return linter.run(oasDoc1).then((results) => {
    expect(results.length).toBe(0)
  })
})
