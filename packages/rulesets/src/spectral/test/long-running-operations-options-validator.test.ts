import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("LongRunningOperationsOptionsValidator")
  return linter
})

test("LongRunningOperationsOptionsValidator should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        post: {
          "x-ms-long-running-operation": true,
          responses: {
            200: {
              description: "Success",
              schema: {
                $ref: "#/definitions/ConfigServerResource",
              },
            },
          },
        },
      },
    },
    definitions: {
      ConfigServerResource: {
        description: "Config Server resource",
        type: "object",
        properties: {
          provisioningState: {
            description: "State of the config server.",
            enum: ["NotAvailable", "Deleted", "Failed", "Succeeded", "Updating"],
            type: "string",
            readOnly: true,
            "x-ms-enum": {
              name: "ConfigServerState",
              modelAsString: true,
            },
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./api/Paths")
  })
})

test("LongRunningOperationsOptionsValidator should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        post: {
          "x-ms-long-running-operation": true,
          "x-ms-long-running-operation-options": {
            "final-state-via": "location",
          },
          responses: {
            200: {
              description: "Success",
              schema: {
                $ref: "#/definitions/ConfigServerResource",
              },
            },
          },
        },
      },
    },
    definitions: {
      ConfigServerResource: {
        description: "Config Server resource",
        type: "object",
        properties: {
          provisioningState: {
            description: "State of the config server.",
            enum: ["NotAvailable", "Deleted", "Failed", "Succeeded", "Updating"],
            type: "string",
            readOnly: true,
            "x-ms-enum": {
              name: "ConfigServerState",
              modelAsString: true,
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
