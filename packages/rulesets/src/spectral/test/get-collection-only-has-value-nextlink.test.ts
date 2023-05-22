import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("GetCollectionResponseSchema")
  return linter
})

test("GetCollectionResponseSchema should find no errors when get collection schema has only value and nextLink properties", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        get: {
          operationId: "Noun_Get",
          responses: {
            "200": {
              schema: {
                $ref: "#/definitions/ListResult",
              },
            },
            default: {
              description: "Unexpected error",
            },
          },
        },
      },
    },
    definitions: {
      ListResult: {
        type: "object",
        required: ["value"],
        description: "List of resources",
        additionalProperties: false,
        properties: {
          value: {
            description: "An array of resources.",
            type: "array",
            items: {
              $ref: "#/definitions/Resource",
            },
          },
          nextLink: {
            description: "URI to fetch the next section of the paginated response.",
            type: "string",
            readOnly: true,
          },
        },
      },
      Resource: {
        "x-ms-azure-resource": true,
        properties: {
          id: {
            type: "string",
            readOnly: true,
            description: "Resource Id",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("GetCollectionResponseSchema should find errors when get collection schema has properties other than value and nextLink", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        get: {
          operationId: "Noun_Get",
          responses: {
            "200": {
              schema: {
                $ref: "#/definitions/ListResult",
              },
            },
            default: {
              description: "Unexpected error",
            },
          },
        },
      },
    },
    definitions: {
      ListResult: {
        type: "object",
        required: ["value"],
        description: "List of resources",
        additionalProperties: false,
        properties: {
          value: {
            description: "An array of resources.",
            type: "array",
            items: {
              $ref: "#/definitions/Resource",
            },
          },
          nextLink: {
            description: "URI to fetch the next section of the paginated response.",
            type: "string",
            readOnly: true,
          },
          somethingElse: {
            description: "This should not be here.",
          },
        },
      },
      Resource: {
        "x-ms-azure-resource": true,
        properties: {
          id: {
            type: "string",
            readOnly: true,
            description: "Resource Id",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.get.responses.200.schema.properties")
    expect(results[0].message).toBe(
      "Get endpoints for collections of resources must only have the `value` and `nextLink` properties in their model."
    )
  })
})

test("GetCollectionResponseSchema should find errors when nextLink is missing", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        get: {
          operationId: "Noun_Get",
          responses: {
            "200": {
              schema: {
                $ref: "#/definitions/ListResult",
              },
            },
            default: {
              description: "Unexpected error",
            },
          },
        },
      },
    },
    definitions: {
      ListResult: {
        type: "object",
        required: ["value"],
        description: "List of resources",
        additionalProperties: false,
        properties: {
          value: {
            description: "An array of resources.",
            type: "array",
            items: {
              $ref: "#/definitions/Resource",
            },
          },
        },
      },
      Resource: {
        "x-ms-azure-resource": true,
        properties: {
          id: {
            type: "string",
            readOnly: true,
            description: "Resource Id",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.get.responses.200.schema.properties")
    expect(results[0].message).toBe(
      "Get endpoints for collections of resources must only have the `value` and `nextLink` properties in their model."
    )
  })
})

test("GetCollectionResponseSchema should find errors when value is missing", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        get: {
          operationId: "Noun_Get",
          responses: {
            "200": {
              schema: {
                $ref: "#/definitions/ListResult",
              },
            },
            default: {
              description: "Unexpected error",
            },
          },
        },
      },
    },
    definitions: {
      ListResult: {
        type: "object",
        required: ["value"],
        description: "List of resources",
        additionalProperties: false,
        properties: {
          nextLink: {
            description: "URI to fetch the next section of the paginated response.",
            type: "string",
            readOnly: true,
          },
        },
      },
      Resource: {
        "x-ms-azure-resource": true,
        properties: {
          id: {
            type: "string",
            readOnly: true,
            description: "Resource Id",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.get.responses.200.schema.properties")
    expect(results[0].message).toBe(
      "Get endpoints for collections of resources must only have the `value` and `nextLink` properties in their model."
    )
  })
})
