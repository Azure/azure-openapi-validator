import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("XmsLongRunningOperationOptions")
  return linter
})

test("XmsLongRunningOperationOptions should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        patch: {
          "x-ms-long-running-operation": true,
          responses: {
            202: {
              description: "Success",
            },
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.patch")
  })
})
test("XmsLongRunningOperationOptions should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        patch: {
          "x-ms-long-running-operation": true,
          "x-ms-long-running-operation-options": {
            "final-status-via": "location",
          },
          responses: {
            202: {
              description: "Success",
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
