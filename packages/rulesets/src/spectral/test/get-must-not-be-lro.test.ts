import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("GetMustNotBeLRO")
  return linter
})

test("GetMustNotBeLRO should find errors when x-ms-long-running-operation-options is specified with a get call", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        get: {
          operationId: "Noun_Get",
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
          "x-ms-long-running-operation": true,
          "x-ms-long-running-operation-options": {
            "final-state-via": "azure-async-operation",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.get.x-ms-long-running-operation")
    expect(results[0].message).toContain(
      "The Get call cannot be Long Running Operation and it must not have x-ms-long-running-operation property."
    )
    expect(results[1].path.join(".")).toBe("paths./api/Paths.get.x-ms-long-running-operation-options")
    expect(results[1].message).toContain(
      "The Get call cannot be Long Running Operation and it must not have x-ms-long-running-operation property."
    )
  })
})

test("GetMustNotBeLRO should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        get: {
          operationId: "Noun_Get",
          responses: {
            default: {
              description: "Unexpected error",
            },
          },
          "x-ms-long-running-operation": false,
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
