import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("GetResponseCodes")
  return linter
})

const GET_RESPONSE_ERROR =
  "GET operation must have response codes 200 and default. In addition, can have 202 if the GET represents the location header polling url."
const EmptyResponse_ERROR =
  "GET operation response codes must be non-empty. It must have response codes 200 and default. In addition, can have 202 if the GET represents the location header polling url."
  

test("GetResponseCodes should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        get: {
          operationId: "foo_post",
          responses: {
            200: {
              description: "Success",
            },
            default: {
              description: "Error",
            },
          },
        },
      },
      "/foo1/operations": {
        get: {
          operationId: "foo_post",
          responses: {
            200: {
              description: "Success",
            },
            202: {
              description: "Accepted",
              "headers": {
                "Location": {
                  "description": "The URL where the status of the asynchronous operation can be checked.",
                  "type": "string"
                },
              },
            },
            default: {
              description: "Error",
            },
          },
        },
      },
    }
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("GetResponseCodes should find errors if responses are not defined", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        get: {
          operationId: "foo_post",
          responses:{

          },
        },
      },
    }
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./foo.get")
    expect(results[0].message).toContain(EmptyResponse_ERROR)
  })
})

test("GetResponseCodes should find errors if 200 is not defined", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo/operations": {
        get: {
          operationId: "foo_post",
          responses: {
            202: {
              description: "Accepted",
              headers: {
                Location: {
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
      },
    }
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./foo/operations.get")
    expect(results[0].message).toContain(GET_RESPONSE_ERROR)
  })
})

test("GetResponseCodes should find errors if non-accepted response codes are defined", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo/operations": {
        get: {
          operationId: "foo_post",
          responses: {
            200: {
              description: "Success",
            },
            204: {
              description: "Accepted",
              headers: {
                Location: {
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
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./foo/operations.get")
    expect(results[0].message).toContain(GET_RESPONSE_ERROR)
  })
})
