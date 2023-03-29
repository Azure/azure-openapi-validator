import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral
const RULE = "NoErrorCodeResponses"
const ERROR_MESSAGE = "Responses must not have error codes. All errors must be surfaced using `default`."

beforeAll(async () => {
  linter = linterForRule(RULE)
  return linter
})

test(`${RULE} should find errors`, async () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Bakery/breads/{breadName}": {
        get: {
          responses: {
            200: {
              description: "a response",
              schema: {
                $ref: "#/definitions/Bread",
              },
            },
          },
        },
        put: {
          responses: {
            200: {
              description: "a response",
              schema: {
                $ref: "#/definitions/Bread",
              },
            },
            201: {
              description: "a response",
              schema: {
                $ref: "#/definitions/Bread",
              },
            },
            500: {
              description: "a response",
              schema: {
                $ref: "#/definitions/Bread",
              },
            },
            default: {
              description: "a response",
              schema: {
                $ref: "#/definitions/Bread",
              },
            },
          },
        },
        delete: {
          responses: {
            401: {
              description: "an error response",
              schema: {
                properties: {},
              },
            },
          },
        },
        patch: {
          responses: {
            400: {
              description: "an error response",
              schema: {
                properties: {},
              },
            },
          },
        },
        head: {
          responses: {
            302: {
              description: "an error response",
              schema: {
                properties: {},
              },
            },
          },
        },
      },
    },
    definitions: {
      Bread: {
        type: "object",
        properties: {
          name: {
            description: "bread name",
            type: "string",
          },
        },
      },
    },
  }

  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(4)
    expect(results[0].message).toBe(ERROR_MESSAGE)
    expect(results[0].path.join(".")).toBe("paths./providers/Microsoft.Bakery/breads/{breadName}.put.responses.500")
    expect(results[1].message).toBe(ERROR_MESSAGE)
    expect(results[1].path.join(".")).toBe("paths./providers/Microsoft.Bakery/breads/{breadName}.delete.responses.401")
    expect(results[2].message).toBe(ERROR_MESSAGE)
    expect(results[2].path.join(".")).toBe("paths./providers/Microsoft.Bakery/breads/{breadName}.patch.responses.400")
    expect(results[3].message).toBe(ERROR_MESSAGE)
    expect(results[3].path.join(".")).toBe("paths./providers/Microsoft.Bakery/breads/{breadName}.head.responses.302")
  })
})

test(`${RULE} should find no errors`, async () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Bakery/breads/{breadName}": {
        get: {
          responses: {
            200: {
              description: "a response",
              schema: {
                $ref: "#/definitions/Bread",
              },
            },
          },
        },
        put: {
          responses: {
            200: {
              description: "a response",
              schema: {
                $ref: "#/definitions/Bread",
              },
            },
            201: {
              description: "a response",
              schema: {
                $ref: "#/definitions/Bread",
              },
            },
            202: {
              description: "a response",
              schema: {
                $ref: "#/definitions/Bread",
              },
            },
            204: {
              description: "a response",
              schema: {
                $ref: "#/definitions/Bread",
              },
            },
          },
        },
        delete: {
          responses: {
            200: {
              description: "a response",
              schema: {
                $ref: "#/definitions/Bread",
              },
            },
            201: {
              description: "a response",
              schema: {
                $ref: "#/definitions/Bread",
              },
            },
            202: {
              description: "a response",
              schema: {
                $ref: "#/definitions/Bread",
              },
            },
            204: {
              description: "a response",
              schema: {
                $ref: "#/definitions/Bread",
              },
            },
          },
        },
      },
    },
    definitions: {
      Bread: {
        type: "object",
        properties: {
          name: {
            description: "bread name",
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
