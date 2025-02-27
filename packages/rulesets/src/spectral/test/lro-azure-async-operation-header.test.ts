import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("LroAzureAsyncOperationHeader")
  return linter
})

const ERROR_MESSAGE = "All long-running operations that define the `headers` field must include an `Azure-AsyncOperation` response header."

test("LroAzureAsyncOperationHeader should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo1/operations": {
        get: {
          operationId: "foo_get",
          responses: {
            200: {
              description: "Success",
            },
            202: {
              description: "Accepted",
              // no header scenario
            },
            default: {
              description: "Error",
            },
          },
        },
        post: {
          operationId: "foo_post",
          "x-ms-long-running-operation": true,
          responses: {
            200: {
              description: "Success",
            },
            202: {
              description: "Accepted",
              headers: {
                "Azure-AsyncOperation": {
                  description: "The URL where the status of the asynchronous operation can be checked.",
                  type: "string",
                },
              },
            },
            default: {
              description: "Error",
            },
          },
        },
        put: {
          operationId: "foo_put",
          "x-ms-long-running-operation": true,
          responses: {
            204: {
              description: "Accepted",
              headers: {
                "Azure-AsyncOperation": {
                  description: "The URL where the status of the asynchronous operation can be checked.",
                  type: "string",
                },
              },
            },
            default: {
              description: "Error",
            },
          },
        },
        delete: {
          operationId: "foo_put",
          responses: {
            204: {
              description: "No x-ms-long-running-operation ",
            },
            default: {
              description: "Error",
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

test("LroAzureAsyncOperationHeader should find errors with no Azure-AsyncOperation header", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo1/operations": {
        get: {
          operationId: "foo_get",
          "x-ms-long-running-operation": true,
          responses: {
            200: {
              description: "Success",
            },
            202: {
              description: "Accepted",
              headers: {
                Location: {
                  description: "No Azure-AsyncOperation header",
                  type: "string",
                },
              },
            },
            default: {
              description: "Error",
            },
          },
        },
        post: {
          operationId: "foo_post",
          "x-ms-long-running-operation": false,
          responses: {
            200: {
              description: "Success",
            },
            202: {
              description: "Empty header case",
              headers: {
                Location: {
                  description: "No Azure-AsyncOperation header",
                  type: "string",
                },
              },
            },
            default: {
              description: "Error",
            },
          },
        },
        put: {
          operationId: "foo_put",
          "x-ms-long-running-operation": true,
          responses: {
            200: {
              description: "Success",
            },
            202: {
              description: "Accepted",
              headers: {
                "azure-asyncOperation1": {
                  description: "check the wrong wording",
                  type: "string",
                },
              },
            },
            default: {
              description: "Error",
            },
          },
        },
        delete: {
          operationId: "foo_put",
          "x-ms-long-running-operation": true,
          responses: {
            202: {
              description: "Accepted",
              headers: {
                "azure-asyncOperation": {
                  description: "Check case sensitive scenario",
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(3)
    expect(results[0].path.join(".")).toBe("paths./foo1/operations.get.responses.202.headers.Location")
    expect(results[0].message).toEqual(ERROR_MESSAGE)
    expect(results[1].path.join(".")).toBe("paths./foo1/operations.put.responses.202.headers.azure-asyncOperation1")
    expect(results[1].message).toEqual(ERROR_MESSAGE)
    expect(results[2].path.join(".")).toBe("paths./foo1/operations.delete.responses.202.headers.azure-asyncOperation")
    expect(results[2].message).toEqual(ERROR_MESSAGE)
  })
})
