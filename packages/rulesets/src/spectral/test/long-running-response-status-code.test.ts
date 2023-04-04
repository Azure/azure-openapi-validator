import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("LongRunningResponseStatusCode")
  return linter
})

test("LongRunningResponseStatusCode should find no errors for multiple verbs in a path", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MachineLearningServices/workspaces/{workspaceName}/featuresets/{name}":
        {
          delete: {
            summary: "Delete container.",
            parameters: [
              {
                $ref: "../../../../../common-types/resource-management/v3/types.json#/parameters/SubscriptionIdParameter",
              },
              {
                $ref: "../../../../../common-types/resource-management/v3/types.json#/parameters/ResourceGroupNameParameter",
              },
              {
                $ref: "machineLearningServices.json#/parameters/WorkspaceNameParameter",
              },
            ],
            responses: {
              default: {
                description: "Error",
                schema: {
                  $ref: "../../../../../common-types/resource-management/v3/types.json#/definitions/ErrorResponse",
                },
              },
              "200": {
                description: "Success",
              },
              "202": {
                description: "Accepted",
                headers: {
                  "x-ms-async-operation-timeout": {
                    description: "Timeout for the client to use when polling the asynchronous operation.",
                    type: "string",
                    format: "duration",
                  },
                  Location: {
                    description: "URI to poll for asynchronous operation result.",
                    type: "string",
                  },
                  "Retry-After": {
                    description: "Duration the client should wait between requests, in seconds.",
                    type: "integer",
                    format: "int32",
                    maximum: 600,
                    minimum: 10,
                  },
                },
              },
              "204": {
                description: "No Content",
              },
            },
            "x-ms-examples": {
              "Delete Workspace Featureset Container.": {
                $ref: "./examples/Workspace/FeaturesetContainer/delete.json",
              },
            },
            "x-ms-long-running-operation": true,
          },
          get: {
            summary: "Get container.",
            parameters: [
              {
                $ref: "../../../../../common-types/resource-management/v3/types.json#/parameters/SubscriptionIdParameter",
              },
              {
                $ref: "../../../../../common-types/resource-management/v3/types.json#/parameters/ResourceGroupNameParameter",
              },
              {
                $ref: "machineLearningServices.json#/parameters/WorkspaceNameParameter",
              },
            ],
            responses: {
              default: {
                description: "Error",
                schema: {
                  $ref: "../../../../../common-types/resource-management/v3/types.json#/definitions/ErrorResponse",
                },
              },
              "200": {
                description: "Success",
                schema: {
                  $ref: "#/definitions/FeaturesetContainerResource",
                },
              },
            },
            "x-ms-examples": {
              "GetEntity Workspace Featureset Container.": {
                $ref: "./examples/Workspace/FeaturesetContainer/getEntity.json",
              },
            },
            "x-ms-long-running-operation": true,
          },
          put: {
            summary: "Create or update container.",
            parameters: [
              {
                $ref: "../../../../../common-types/resource-management/v3/types.json#/parameters/SubscriptionIdParameter",
              },
              {
                $ref: "../../../../../common-types/resource-management/v3/types.json#/parameters/ResourceGroupNameParameter",
              },
              {
                $ref: "machineLearningServices.json#/parameters/WorkspaceNameParameter",
              },
            ],
            responses: {
              default: {
                description: "Error",
                schema: {
                  $ref: "../../../../../common-types/resource-management/v3/types.json#/definitions/ErrorResponse",
                },
              },
              "200": {
                description: "Success",
                schema: {
                  $ref: "#/definitions/FeaturesetContainerResource",
                },
              },
              "201": {
                description: "Created",
                schema: {
                  $ref: "#/definitions/FeaturesetContainerResource",
                },
                headers: {
                  "x-ms-async-operation-timeout": {
                    description: "Timeout for the client to use when polling the asynchronous operation.",
                    type: "string",
                    format: "duration",
                  },
                  "Azure-AsyncOperation": {
                    description: "URI to poll for asynchronous operation status.",
                    type: "string",
                  },
                },
              },
            },
            "x-ms-examples": {
              "CreateOrUpdate Workspace Featureset Container.": {
                $ref: "./examples/Workspace/FeaturesetContainer/createOrUpdate.json",
              },
            },
            "x-ms-long-running-operation": true,
          },
        },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(
      results.filter((result) =>
        result.message.includes("with x-ms-long-running-operation extension must have a valid terminal success status code ")
      ).length
    ).toBe(0)
  })
})

test("LongRunningResponseStatusCode should find errors in DELETE operation", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        delete: {
          "x-ms-long-running-operation": true,
          responses: {
            201: {
              description: "Success",
            },
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
    expect(results[0].path.join(".")).toBe("paths./api/Paths.delete")
  })
})

test("LongRunningResponseStatusCode should find errors in POST operation", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        post: {
          "x-ms-long-running-operation": true,
          responses: {
            default: {
              description: "Success",
            },
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.post")
  })
})

test("LongRunningResponseStatusCode should find errors in PUT operation", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          "x-ms-long-running-operation": true,
          responses: {
            202: {
              description: "Success",
            },
            204: {
              description: "Success",
            },
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.put")
  })
})

test("LongRunningResponseStatusCode should find errors in PATCH operation", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        patch: {
          "x-ms-long-running-operation": true,
          responses: {
            204: {
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

test("LongRunningResponseStatusCode should find no errors in DELETE operation", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        delete: {
          "x-ms-long-running-operation": true,
          responses: {
            200: {
              description: "Success",
            },
            204: {
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

test("LongRunningResponseStatusCode should find no errors in POST operation", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        post: {
          "x-ms-long-running-operation": true,
          responses: {
            200: {
              description: "Success",
            },
            201: {
              description: "Success",
            },
            202: {
              description: "Success",
            },
            204: {
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

test("LongRunningResponseStatusCode should find no errors in PUT operation", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          "x-ms-long-running-operation": true,
          responses: {
            200: {
              description: "Success",
            },
            201: {
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

test("LongRunningResponseStatusCode should find no errors in PATCH operation", () => {
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
            201: {
              description: "Success",
            },
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
