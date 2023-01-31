import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("XmsClientNameProperty")
  return linter
})

test("XmsClientNameProperty should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    definitions: {
      item1: {
        properties: {
          prop1: {
            "x-ms-client-name": "prop1",
            type: "string",
            format: "base64url",
            description: "name.",
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
    definitions: {
      item1: {
        properties: {
          prop1: {
            "x-ms-client-name": "prop",
            type: "string",
            format: "base64url",
            description: "name.",
          },
          prop2: {
            type: "string",
            format: "base64url",
            description: "name.",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
