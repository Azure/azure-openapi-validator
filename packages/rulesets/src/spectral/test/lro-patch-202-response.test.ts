import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("LroPatch202")
  return linter
})

test("LroPatch202 should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        patch: {
          "x-ms-long-running-operation": true,
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
    expect(results[0].path.join(".")).toBe("paths./api/Paths.patch.responses")
  })
})
