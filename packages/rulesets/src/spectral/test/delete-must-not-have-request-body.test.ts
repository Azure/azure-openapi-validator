import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("DeleteMustNotHaveRequestBody")
  return linter
})

test("DeleteMustNotHaveRequestBody should find errors when body is specified with a delete", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        delete: {
          operationId: "Noun_Delete",
          parameters: [
            {
              name: "body",
              in: "body",
              type: "string",
              required: true,
            },
          ],
          responses: {
            default: {
              description: "Unexpected error",
            },
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.delete.parameters.0")
  })
})

test("DeleteMustNotHaveRequestBody should find no errors when body is not specified with a delete", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        get: {
          operationId: "Noun_Delete",
          responses: {
            default: {
              description: "Unexpected error",
            },
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
