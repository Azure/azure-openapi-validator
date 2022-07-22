import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("DeleteResponseBodyEmpty")
  return linter
})

test("DeleteResponseBodyEmpty should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        delete: {
          responses: {
            200: {
              description: "Success",
              schema: {
                type: "string",
              },
            },
            204: {
              description: "Deleted",
              schema: {
                type: "string",
              },
            },
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.delete.responses.200.schema")
    expect(results[1].path.join(".")).toBe("paths./api/Paths.delete.responses.204.schema")
  })
})
