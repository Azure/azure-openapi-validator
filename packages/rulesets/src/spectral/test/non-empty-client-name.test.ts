import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("NonEmptyClientName")
  return linter
})

test("NonEmptyClientName should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          operationId: "Path_Create",
          responses: {
            200: {
              description: "Success",
              schema: {
                $ref: "#/definitions/LroStatusCodeSchema",
              },
            },
          },
        },
      },
    },
    definitions: {
      LroStatusCodeSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            "x-ms-client-name": "",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toBe("Empty x-ms-client-name property.")
  })
})

test("NonEmptyClientName should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          operationId: "Path_Create",
          responses: {
            200: {
              description: "Success",
              schema: {
                $ref: "#/definitions/LroStatusCodeSchema",
              },
            },
          },
        },
      },
    },
    definitions: {
      LroStatusCodeSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            "x-ms-client-name": "Name",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
