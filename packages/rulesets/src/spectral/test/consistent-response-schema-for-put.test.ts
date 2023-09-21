import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("ConsistentResponseSchemaForPut")
  return linter
})

test("ConsistentResponseSchemaForPut should find errors when response schema for 200 and 201 status codes are different", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          operationId: "Noun_Put",
          parameters: [
            {
              name: "subscriptionId",
              in: "path",
              required: true,
              type: "string",
              description: "The name of the subscription",
            },
            {
              name: "resourceGroupName",
              in: "path",
              required: true,
              type: "string",
              description: "The name of the resource group",
            },
          ],
          responses: {
            default: {
              description: "Unexpected error",
            },
            "200": {
              description: "The resource was replaced.",
              schema: {
                $ref: "#/definitions/DataConnector",
              },
            },
            "201": {
              description: "Unexpected error",
              schema: {
                $ref: "#/definitions/DataConnectorCreateResponse",
              },
            },
          },
        },
      },
    },
    definitions: {
      DataConnector: {
        description: "Data connector object.",
        type: "object",
        properties: {
          details: {
            type: "string",
            description: "The details of the data connector.",
          },
        },
      },
      DataConnectorCreateResponse: {
        description: "Data connector create respnse object.",
        type: "object",
        properties: {
          innerDetails: {
            type: "string",
            description: "The inner details.",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.put.responses.200.schema")
    expect(results[0].message).toContain("Response body schema does not match create response body schema.")
  })
})

test("ConsistentResponseSchemaForPut should not find errors when response schema for 200 and 201 status codes are same", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          operationId: "Noun_Put",
          parameters: [
            {
              name: "subscriptionId",
              in: "path",
              required: true,
              type: "string",
              description: "The name of the subscription",
            },
            {
              name: "resourceGroupName",
              in: "path",
              required: true,
              type: "string",
              description: "The name of the resource group",
            },
          ],
          responses: {
            default: {
              description: "Unexpected error",
            },
            "200": {
              description: "The resource was replaced.",
              schema: {
                $ref: "#/definitions/DataConnector",
              },
            },
            "201": {
              description: "Unexpected error",
              schema: {
                $ref: "#/definitions/DataConnector",
              },
            },
          },
        },
      },
    },
    definitions: {
      DataConnector: {
        description: "Data connector object.",
        type: "object",
        properties: {
          details: {
            type: "string",
            description: "The details of the data connector.",
          },
        },
      },
      DataConnectorCreateResponse: {
        description: "Data connector create respnse object.",
        type: "object",
        properties: {
          innerDetails: {
            type: "string",
            description: "The inner details.",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
