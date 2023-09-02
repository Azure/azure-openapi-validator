import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

const errorMessage =
  "If an operation's (PUT/POST/PATCH/DELETE) responses have `Location` or `Azure-AsyncOperation` headers then it MUST have the property `x-ms-long-running-operation` set to `true`"

beforeAll(async () => {
  linter = await linterForRule("XMSLongRunningOperationProperty")
  return linter
})

test("XMSLongRunningOperationProperty should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          responses: {
            201: {
              description: "Put call with two headers and no x-ms-long-running-operation.",
              headers: {
                "Azure-AsyncOperation": {
                  type: "string",
                },
                Location: {
                  type: "string",
                },
              },
            },
          },
        },
        patch: {
          responses: {
            201: {
              description: "Success",
            },
            202: {
              description: "Patch call with two headers and x-ms-long-running-operation set to false.",
              headers: {
                "azure-Asyncoperation": {
                  type: "string",
                },
                Location: {
                  type: "string",
                },
              },
            },
          },
          "x-ms-pageable": {
            nextLinkName: null,
          },
          "x-ms-long-running-operation": false,
        },
        post: {
          description: "post call",
          responses: {
            "200": {
              headers: {
                Location: {
                  type: "string",
                  description: "Post call with Location header and no x-ms-long-running-operation.",
                },
              },
            },
            "404": {
              description: "Not found.",
              "x-ms-error-response": true,
            },
          },
        },
        delete: {
          description: "delete call",
          responses: {
            "202": {
              headers: {
                "azure-asyncOperation": {
                  type: "string",
                  description: "Delete call with Azure-AsyncOperation header and no x-ms-long-running-operation.",
                },
              },
            },
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(4)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.put.responses.201.headers.Azure-AsyncOperation")
    expect(results[1].path.join(".")).toBe("paths./api/Paths.patch.responses.202.headers.azure-Asyncoperation")
    expect(results[2].path.join(".")).toBe("paths./api/Paths.post.responses.200.headers.Location")
    expect(results[3].path.join(".")).toBe("paths./api/Paths.delete.responses.202.headers.azure-asyncOperation")
    expect(results[0].message).toBe(errorMessage)
    expect(results[1].message).toBe(errorMessage)
    expect(results[2].message).toBe(errorMessage)
    expect(results[3].message).toBe(errorMessage)
  })
})

test("XMSLongRunningOperationProperty should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          responses: {
            201: {
              description: "Put call with Azure-AsyncOperation header and x-ms-long-running-operation set to true",
              headers: {
                "azure-Asyncoperation": {
                  type: "string",
                },
              },
            },
          },
          "x-ms-long-running-operation": true,
        },
        patch: {
          responses: {
            201: {
              description: "Success",
            },
            202: {
              description: "Patch call with both headers and x-ms-long-running-operation set to true.",
              headers: {
                "azure-Asyncoperation": {
                  type: "string",
                },
                Location: {
                  type: "string",
                },
              },
            },
          },
          "x-ms-long-running-operation": true,
        },
        post: {
          responses: {
            "200": {
              headers: {
                Location: {
                  type: "string",
                  description: "Post call with Location header and x-ms-long-running-operation set to true.",
                },
              },
            },
            "404": {
              description: "Not found.",
              "x-ms-error-response": true,
            },
          },
          "x-ms-long-running-operation": true,
        },
        delete: {
          description: "Delete call with no headers and x-ms-long-running-operation set to false.",
          responses: {
            "200": {
              type: "object",
            },
          },
        },
        "x-ms-long-running-operation": false,
      },
    },
  }

  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
