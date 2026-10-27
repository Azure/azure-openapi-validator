import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

const SYNC_ERROR =
  "Synchronous POST operations must have one of the following combinations of responses - 200 and default ; 204 and default. No other response codes are permitted."
const LR_ERROR =
  "Long-running POST operations must only return 202 with a default response. The final state schema must be specified via x-ms-long-running-operation-options. No other response codes are permitted."
const LR_MISSING_OPTIONS_ERROR =
  'A LRO Post operation must have "x-ms-long-running-operation-options" extension with "final-state-via" set to "location" or "azure-async-operation".'
const LR_SCHEMA_ERROR_ACCEPTED = "202 response for a LRO POST operation must not have a response schema specified."
const LR_SCHEMA_ERROR_NO_CONTENT = "204 response for a Sync/LRO POST operation must not have a response schema specified."

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("PostResponseCodes")
  return linter
})

test("PostResponseCodes should find errors for sync post with only 200", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_post",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          },
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResourceUpdate: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          prop0: {
            type: "string",
            default: "my def val",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./foo.post")
    expect(results[0].message).toContain(SYNC_ERROR)
  })
})

test("PostResponseCodes should find errors for sync post with only 204", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_post",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "204": {
              description: "No content",
            },
          },
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResourceUpdate: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          prop0: {
            type: "string",
            default: "my def val",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./foo.post")
    expect(results[0].message).toContain(SYNC_ERROR)
  })
})

test("PostResponseCodes should find errors for sync post without default response", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_post",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "204": {
              description: "No content",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          },
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResourceUpdate: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          prop0: {
            type: "string",
            default: "my def val",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].path.join(".")).toBe("paths./foo.post")
    expect(results[0].message).toContain(SYNC_ERROR)
    expect(results[1].message).toContain(LR_SCHEMA_ERROR_NO_CONTENT)
  })
})

test("PostResponseCodes should find errors for sync post with extra response code", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_post",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
            "204": {
              description: "No content",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
            default: {
              description: "Error",
              schema: {},
            },
          },
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResourceUpdate: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          prop0: {
            type: "string",
            default: "my def val",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].path.join(".")).toBe("paths./foo.post")
    expect(results[0].message).toContain(SYNC_ERROR)
    expect(results[1].message).toContain(LR_SCHEMA_ERROR_NO_CONTENT)
  })
})

test("PostResponseCodes should find errors for post with no responses defined", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_post",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResourceUpdate: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          prop0: {
            type: "string",
            default: "my def val",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./foo.post")
    expect(results[0].message).toContain("POST operation response codes must be non-empty.")
  })
})

test("PostResponseCodes should find errors for post with no responses specified", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_post",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {},
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResourceUpdate: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          prop0: {
            type: "string",
            default: "my def val",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./foo.post")
    expect(results[0].message).toContain("POST operation response codes must be non-empty.")
  })
})

test("PostResponseCodes should find no errors for sync post when 200, default required codes are provided", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_post",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
            default: {
              description: "Error",
              schema: {},
            },
          },
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResourceUpdate: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          prop0: {
            type: "string",
            default: "my def val",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("PostResponseCodes should find no errors for sync post when 204, default required codes are provided", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_post",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "204": {
              description: "No-Content",
            },
            default: {
              description: "Error",
              schema: {},
            },
          },
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResourceUpdate: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          prop0: {
            type: "string",
            default: "my def val",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("PostResponseCodes should find errors for lro post with only 202", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_post",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "202": {
              description: "accepted",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          },
          "x-ms-long-running-operation": true,
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResourceUpdate: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          prop0: {
            type: "string",
            default: "my def val",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(3)
    expect(results[0].path.join(".")).toBe("paths./foo.post")
    expect(results[0].message).toContain(LR_ERROR)
    expect(results[1].path.join(".")).toBe("paths./foo.post")
    expect(results[1].message).toContain(LR_MISSING_OPTIONS_ERROR)
    expect(results[2].path.join(".")).toBe("paths./foo.post")
    expect(results[2].message).toContain(LR_SCHEMA_ERROR_ACCEPTED)
  })
})

test("PostResponseCodes should find errors for lro post with only 200", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_post",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "created",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          },
          "x-ms-long-running-operation": true,
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResourceUpdate: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          prop0: {
            type: "string",
            default: "my def val",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].path.join(".")).toBe("paths./foo.post")
    expect(results[0].message).toContain(LR_ERROR)
    expect(results[1].path.join(".")).toBe("paths./foo.post")
    expect(results[1].message).toContain(LR_MISSING_OPTIONS_ERROR)
  })
})

test("PostResponseCodes should find errors for lro post without default response and 202 schema", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_post",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "202": {
              description: "accepted",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
            "200": {
              description: "No content",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          },
          "x-ms-long-running-operation": true,
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResourceUpdate: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          prop0: {
            type: "string",
            default: "my def val",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(3)
    expect(results[0].path.join(".")).toBe("paths./foo.post")
    expect(results[0].message).toContain(LR_ERROR)
    expect(results[1].path.join(".")).toBe("paths./foo.post")
    expect(results[1].message).toContain(LR_MISSING_OPTIONS_ERROR)
    expect(results[2].path.join(".")).toBe("paths./foo.post")
    expect(results[2].message).toContain(LR_SCHEMA_ERROR_ACCEPTED)
  })
})

test("PostResponseCodes should find errors for lro post with extra response code", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_post",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "No content",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
            "403": {
              description: "error",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
            default: {
              description: "Error",
              schema: {},
            },
          },
          "x-ms-long-running-operation": true,
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResourceUpdate: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          prop0: {
            type: "string",
            default: "my def val",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].path.join(".")).toBe("paths./foo.post")
    expect(results[0].message).toContain(LR_ERROR)
    expect(results[1].path.join(".")).toBe("paths./foo.post")
    expect(results[1].message).toContain(LR_MISSING_OPTIONS_ERROR)
  })
})

test("PostResponseCodes should find errors for lro post with empty schema in 200 response code and with schema in 202", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_post",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "202": {
              description: "accepted",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
            "200": {
              description: "No content",
            },
            default: {
              description: "Error",
              schema: {},
            },
          },
          "x-ms-long-running-operation": true,
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResourceUpdate: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          prop0: {
            type: "string",
            default: "my def val",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(3)
    expect(results[0].path.join(".")).toBe("paths./foo.post")
    expect(results[0].message).toContain(LR_ERROR)
    expect(results[1].path.join(".")).toBe("paths./foo.post")
    expect(results[1].message).toContain(LR_MISSING_OPTIONS_ERROR)
    expect(results[2].path.join(".")).toBe("paths./foo.post")
    expect(results[2].message).toContain(LR_SCHEMA_ERROR_ACCEPTED)
  })
})

test("PostResponseCodes should find errors for async post with 202 but no x-ms-long-running-operation", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_post",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
            "202": {
              description: "accepted",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
            default: {
              description: "Error",
              schema: {},
            },
          },
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResourceUpdate: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          prop0: {
            type: "string",
            default: "my def val",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./foo.post")
    expect(results[0].message).toContain("An async POST operation must set '\"x-ms-long-running-operation\" : true'.")
  })
})

test("PostResponseCodes should find errors for lro post with 200 in responses (final state must not be on operation)", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_post",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "202": {
              description: "accepted",
            },
            "200": {
              description: "created",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
            default: {
              description: "Error",
              schema: {},
            },
          },
          "x-ms-long-running-operation": true,
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResourceUpdate: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          prop0: {
            type: "string",
            default: "my def val",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].path.join(".")).toBe("paths./foo.post")
    expect(results[0].message).toContain(LR_ERROR)
    expect(results[1].path.join(".")).toBe("paths./foo.post")
    expect(results[1].message).toContain(LR_MISSING_OPTIONS_ERROR)
  })
})

test("PostResponseCodes should find errors for lro post with 204 in responses (final state must not be on operation)", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_post",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "202": {
              description: "accepted",
            },
            "204": {
              description: "No content",
            },
            default: {
              description: "Error",
              schema: {},
            },
          },
          "x-ms-long-running-operation": true,
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResourceUpdate: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          prop0: {
            type: "string",
            default: "my def val",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].path.join(".")).toBe("paths./foo.post")
    expect(results[0].message).toContain(LR_ERROR)
    expect(results[1].path.join(".")).toBe("paths./foo.post")
    expect(results[1].message).toContain(LR_MISSING_OPTIONS_ERROR)
  })
})

const definitionsBlock = {
  FooRequestParams: {
    allOf: [{ $ref: "#/definitions/FooProps" }],
  },
  FooResource: {
    allOf: [{ $ref: "#/definitions/FooProps" }],
  },
  FooResourceUpdate: {
    allOf: [{ $ref: "#/definitions/FooProps" }],
  },
  FooProps: {
    properties: {
      prop0: { type: "string", default: "my def val" },
    },
  },
}

test("PostResponseCodes should find no errors for lro post when 202, default, and x-ms-long-running-operation-options with location are provided", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          operationId: "Foo_Create",
          responses: {
            "202": { description: "accepted" },
            default: { description: "Error", schema: {} },
          },
          "x-ms-long-running-operation": true,
          "x-ms-long-running-operation-options": {
            "final-state-via": "location",
          },
        },
      },
    },
    definitions: definitionsBlock,
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("PostResponseCodes should find no errors for lro post when 202, default, and x-ms-long-running-operation-options with azure-async-operation are provided", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          operationId: "Foo_Create",
          responses: {
            "202": { description: "accepted" },
            default: { description: "Error", schema: {} },
          },
          "x-ms-long-running-operation": true,
          "x-ms-long-running-operation-options": {
            "final-state-via": "azure-async-operation",
          },
        },
      },
    },
    definitions: definitionsBlock,
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("PostResponseCodes should find errors for lro post with 202, default but missing x-ms-long-running-operation-options", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          operationId: "Foo_Create",
          responses: {
            "202": { description: "accepted" },
            default: { description: "Error", schema: {} },
          },
          "x-ms-long-running-operation": true,
        },
      },
    },
    definitions: definitionsBlock,
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./foo.post")
    expect(results[0].message).toContain(LR_MISSING_OPTIONS_ERROR)
  })
})

test("PostResponseCodes should find errors for lro post with 202, default but x-ms-long-running-operation-options missing final-state-via", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          operationId: "Foo_Create",
          responses: {
            "202": { description: "accepted" },
            default: { description: "Error", schema: {} },
          },
          "x-ms-long-running-operation": true,
          "x-ms-long-running-operation-options": {},
        },
      },
    },
    definitions: definitionsBlock,
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./foo.post")
    expect(results[0].message).toContain(LR_MISSING_OPTIONS_ERROR)
  })
})
