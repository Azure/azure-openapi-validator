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
    expect(results.length).toBe(1)
    expect(results[0].message).toBe(ERROR_MESSAGE)
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
