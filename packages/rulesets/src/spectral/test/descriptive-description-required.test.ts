import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("DescriptiveDescriptionRequired")
  return linter
})

test("DescriptiveDescriptionRequired should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        parameters: [
          {
            name: "version",
            description: "", //Covered by ParameterDescription rule.
          },
        ],
        get: {
          parameters: [
            {
              name: "param1",
              description: " ",
            },
          ],
        },
        post: {
          parameters: [
            {
              name: "param1",
              description: "Test",
            },
          ],
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
  })
})

test("DescriptiveDescriptionRequired should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        parameters: [
          {
            name: "version",
            description: "Hello",
          },
        ],
        get: {
          parameters: [
            {
              name: "param1",
              description: " Test",
            },
          ],
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
