import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let nonResolvingLinter: Spectral

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
