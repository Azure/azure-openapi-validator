import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("NextLinkPropertyMustExist")
  return linter
})

test("NextLinkPropertyMustExist should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          operationId: "Path_Create",
          "x-ms-pageable": {
            nextLinkName: "nextLinks",
          },
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
          },
          nextLink: {
            type: "string",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toBe(
      `The property 'nextLinks' specified by nextLinkName does not exist in the 200 response schema. Please, specify the name of the property that provides the nextLink. If the model does not have the nextLink property then specify null.`
    )
    expect(results[0].path.join(".")).toBe("paths./api/Paths.put")
  })
})

test("NextLinkPropertyMustExist should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          operationId: "Path_Create",
          "x-ms-pageable": {
            nextLinkName: "nextLink",
          },
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
          },
          nextLink: {
            type: "string",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
