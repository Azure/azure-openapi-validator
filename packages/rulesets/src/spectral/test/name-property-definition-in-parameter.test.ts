import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("NamePropertyDefinitionInParameter")
  return linter
})

test("NamePropertyDefinitionInParameter should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          operationId: "Path_Create",
          parameters: [
            {
              name: "",
              in: "path",
              type: "string",
            }
          ],
          responses: {
            200: {
              description: "Success",
            },
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.put.parameters")
  })
})
