import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("XmsExamplesRequired")
  return linter
})

test("XmsClientNameProperty should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Storage/operations": {
        get: {
          responses: {
            "200": {
              description: "OK. The request has succeeded.",
            },
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
  })
})

test("XmsClientNameProperty should pass check", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Storage/operations": {
        get: {
          responses: {
            "200": {
              description: "OK. The request has succeeded.",
            },
          },
          "x-ms-examples": {
            GetCertificates: {
              $ref: "#/swagger",
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
