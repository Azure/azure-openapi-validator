import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("SyncPostReturn")
  return linter
})

test("SyncPostReturn should find errors if both 200 & 204 are specified", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
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
              description: "Success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
            "204": {
              description: "Success-No content",
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
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./foo.post")
    expect(results[0].message).toContain("A synchronous POST operation must have either 200 or 204 return codes.")
  })
})

test("SyncPostReturn should find errors if both 200 & 204 aren't specified", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
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
            "201": {
              description: "Success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
            "202": {
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
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./foo.post")
    expect(results[0].message).toContain("A synchronous POST operation must have either 200 or 204 return codes.")
  })
})

test("SyncPostReturn should find errors if 200 response code is specified without schema", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
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
              description: "Success",
            },
            "202": {
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
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./foo.post")
    expect(results[0].message).toContain(
      "The 200 response code has missing schema. 200 response for a synchronous POST operation must have a response schema specified."
    )
  })
})

test("SyncPostReturn should find errors if 204 response code is specified with schema", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
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
            "201": {
              description: "Success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
            "204": {
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
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./foo.post")
    expect(results[0].message).toContain(
      "Schema defined in 204 response code. 204 response for a synchronous POST operation must not have a response schema specified."
    )
  })
})

test("SyncPostReturn with 200 response code & schema specified should find no errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
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
              description: "Success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
            "202": {
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
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("SyncPostReturn with 204 response code & no schema specified should find no errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
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
            "201": {
              description: "Success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
            "204": {
              description: "Success-No content",
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
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
