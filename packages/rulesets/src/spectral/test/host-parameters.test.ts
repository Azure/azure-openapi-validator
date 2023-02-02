import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("HostParametersValidation")
  return linter
})

test("host parameter validation should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    "x-ms-parameterized-host": {
      hostTemplate: "{baseUrl}",
      positionInOperation: "last",
      useSchemePrefix: false,
      parameters: [
        {
          $ref: "#/parameters/BaseUrl",
        },
      ],
    },
    parameters: {
      BaseUrl: {
        name: "baseUrl",
        required: true,
        type: "string",
        in: "path",
        "x-ms-skip-url-encoding": true,
        "x-ms-parameter-location": "client",
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].path.join(".")).toBe("x-ms-parameterized-host.parameters.0")
    expect(results[0].message).toBe("The host parameter must be called 'endpoint'.")
    expect(results[1].path.join(".")).toBe("x-ms-parameterized-host.parameters.0")
    expect(results[1].message).toBe("The host parameter must be typed \"type 'string', format 'url'\".")
  })
})

test("host parameters validation should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    "x-ms-parameterized-host": {
      hostTemplate: "{endpoint}",
      positionInOperation: "last",
      useSchemePrefix: false,
      parameters: [
        {
          $ref: "#/parameters/Endpoint",
        },
      ],
    },
    parameters: {
      Endpoint: {
        name: "endpoint",
        required: true,
        type: "string",
        format: "url",
        in: "path",
        "x-ms-skip-url-encoding": true,
        "x-ms-parameter-location": "client",
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
