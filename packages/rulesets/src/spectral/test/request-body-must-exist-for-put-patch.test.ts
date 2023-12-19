import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("RequestBodyMustExistForPutPatch")
  return linter
})

test("RequestBodyMustExistForPutPatch should find errors when body parameter is not specified for a put request", () => {
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
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.put.parameters")
    expect(results[0].message).toContain("The put or patch operation does not have a request body defined.")
  })
})

test("RequestBodyMustExistForPutPatch should find errors when the schema for the body parameter is not specified for a put request", () => {
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
            {
              in: "testBody",
              name: "body",
              description: "Body must be valid DataConnector request.",
              required: true,
              // No schema specified here....
            },
          ],
          responses: {
            default: {
              description: "Unexpected error",
            },
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.put.parameters")
    expect(results[0].message).toContain("The put or patch operation does not have a request body defined.")
  })
})

test("RequestBodyMustExistForPutPatch should find errors when the schema for the body parameter is specified as empty for a put request", () => {
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
            {
              in: "testBody",
              name: "body",
              description: "Body must be valid DataConnector request.",
              required: true,
              schema: "",
            },
          ],
          responses: {
            default: {
              description: "Unexpected error",
            },
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.put.parameters")
    expect(results[0].message).toContain("The put or patch operation does not have a request body defined.")
  })
})

test("RequestBodyMustExistForPutPatch should not find errors when the schema for the body parameter is specified for a put request", () => {
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
            {
              in: "testBody",
              name: "body",
              description: "Body must be valid DataConnector request.",
              required: true,
              schema: "#/definitions/FooRequestParams",
            },
          ],
          responses: {
            default: {
              description: "Unexpected error",
            },
          },
        },
      },
    },
    definitions: {
      FooRequestParams: {
        description: "The error detail.",
        type: "object",
        properties: {
          details: {
            type: "object",
            description: "The error details.",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("RequestBodyMustExistForPutPatch should find errors when body parameter is not specified for a patch request", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        patch: {
          operationId: "Noun_Patch",
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
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.patch.parameters")
    expect(results[0].message).toContain("The put or patch operation does not have a request body defined.")
  })
})

test("RequestBodyMustExistForPutPatch should find errors when the schema for the body parameter is not specified for a patch request", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        patch: {
          operationId: "Noun_Patch",
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
            {
              in: "testBody",
              name: "body",
              description: "Body must be valid DataConnector request.",
              required: true,
              // No schema specified here....
            },
          ],
          responses: {
            default: {
              description: "Unexpected error",
            },
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.patch.parameters")
    expect(results[0].message).toContain("The put or patch operation does not have a request body defined.")
  })
})

test("RequestBodyMustExistForPutPatch should find errors when the schema for the body parameter is specified as empty for a patch request", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        patch: {
          operationId: "Noun_Patch",
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
            {
              in: "testBody",
              name: "body",
              description: "Body must be valid DataConnector request.",
              required: true,
              schema: "",
            },
          ],
          responses: {
            default: {
              description: "Unexpected error",
            },
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.patch.parameters")
    expect(results[0].message).toContain("The put or patch operation does not have a request body defined.")
  })
})

test("RequestBodyMustExistForPutPatch should not find errors when the schema for the body parameter is specified for a patch request", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        patch: {
          operationId: "Noun_Patch",
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
            {
              in: "testBody",
              name: "body",
              description: "Body must be valid DataConnector request.",
              required: true,
              schema: "#/definitions/FooRequestParams",
            },
          ],
          responses: {
            default: {
              description: "Unexpected error",
            },
          },
        },
      },
    },
    definitions: {
      FooRequestParams: {
        description: "The error detail.",
        type: "object",
        properties: {
          details: {
            type: "string",
            description: "The error details.",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
