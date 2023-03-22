import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let nonResolvingLinter: Spectral
const errorMessage =
  "Error response content of long running operations must follow the error schema provided in the common types v2 and above."

beforeAll(async () => {
  nonResolvingLinter = await linterForRule("LroErrorContent", true)
  return nonResolvingLinter
})

test("LroErrorContent should find errors for ErrorResponse in same file", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        delete: {
          "x-ms-long-running-operation": true,
          responses: {
            500: {
              description: "An error",
              schema: {
                $ref: "#/definitions/ErrorResponse",
              },
            },
            202: {
              description: "Success",
            },
          },
        },
      },
    },
    definitions: {
      ErrorResponse: {
        description: "an error response",
      },
    },
  }
  return nonResolvingLinter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.delete.responses.500.schema.$ref")
    expect(results[0].message).toEqual(errorMessage)
  })
})

test("LroErrorContent should not find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        delete: {
          "x-ms-long-running-operation": true,
          responses: {
            500: {
              description: "An error",
              schema: {
                $ref: "../../../../../common-types/resource-management/v3/types.json#/definitions/ErrorResponse",
              },
            },
            202: {
              description: "Success",
            },
          },
        },
      },
    },
    definitions: {
      ErrorResponse: {
        description: "an error response",
      },
    },
  }
  return nonResolvingLinter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("LroErrorContent should find errors for outdated common types.json", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        delete: {
          "x-ms-long-running-operation": true,
          responses: {
            500: {
              description: "An error",
              schema: {
                $ref: "../../../../../common-types/resource-management/v1/types.json#/definitions/ErrorResponse",
              },
            },
            202: {
              description: "Success",
            },
          },
        },
      },
    },
    definitions: {
      ErrorResponse: {
        description: "an error response",
      },
    },
  }
  return nonResolvingLinter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.delete.responses.500.schema.$ref")
    expect(results[0].message).toEqual(errorMessage)
  })
})

test("LroErrorContent should not find errors for future common types.json", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        delete: {
          "x-ms-long-running-operation": true,
          responses: {
            500: {
              description: "An error",
              schema: {
                $ref: "../../../../../common-types/resource-management/v10/types.json#/definitions/ErrorResponse",
              },
            },
            202: {
              description: "Success",
            },
          },
        },
      },
    },
    definitions: {
      ErrorResponse: {
        description: "an error response",
      },
    },
  }
  return nonResolvingLinter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
