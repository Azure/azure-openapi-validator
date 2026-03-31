import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("XmsClientName")
  return linter
})

// Helper function to create OpenAPI document with parameters and properties
const createOpenApiDoc = (parameters: unknown[], properties: unknown) => ({
  swagger: "2.0",
  paths: {
    "/api/Paths": {
      put: {
        operationId: "Path_Create",
        parameters,
        responses: {
          200: {
            description: "Success",
            schema: {
              $ref: "#/definitions/Schema",
            },
          },
        },
      },
    },
  },
  definitions: {
    Schema: {
      type: "object",
      properties,
    },
  },
})

test("XmsClientName: invalid combinations (x-ms-client-name matches name)", () => {
  const myOpenApiDocument = createOpenApiDoc(
    [
      {
        name: "resourceGroupName",
        in: "path",
        required: true,
        type: "string",
        description: "The name of the resource group.",
        "x-ms-client-name": "resource-group-name",
      },
      {
        name: "name",
        in: "path",
        required: true,
        type: "string",
        description: "The name of the Redis cache.",
        "x-ms-client-name": "name",
      },
    ],
    {
      length: {
        type: "string",
        "x-ms-client-name": "length",
      },
    }
  )
  return linter.run(myOpenApiDocument).then((results) => {
    // 1 invalid parameter + 1 invalid property = 2 total errors
    expect(results.length).toBe(2)
    results.sort((a, b) => a.path.join(".").localeCompare(b.path.join(".")))
    expect(results[0].message).toBe(`Value of 'x-ms-client-name' cannot be the same as 'name' Property/Model.`)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.put.parameters.1")
    expect(results[1].message).toBe(`Value of 'x-ms-client-name' cannot be the same as 'length' Property/Model.`)
    expect(results[1].path.join(".")).toBe("paths./api/Paths.put.responses.200.schema.properties.length")
  })
})

test("XmsClientName: valid combinations (x-ms-client-name differs from name)", () => {
  const myOpenApiDocument = createOpenApiDoc(
    [
      {
        name: "resourceGroupName",
        in: "path",
        required: true,
        type: "string",
        description: "The name of the resource group.",
        "x-ms-client-name": "resource-group-name",
      },
      {
        name: "name",
        in: "path",
        required: true,
        type: "string",
        description: "The name of the Redis cache.",
        "x-ms-client-name": "Name",
      },
    ],
    {
      length: {
        type: "string",
        "x-ms-client-name": "Length",
      },
    }
  )
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("XmsClientName: properties ignored by given clause", () => {
  const myOpenApiDocument = createOpenApiDoc(
    [
      {
        name: "paramWithoutClientName",
        in: "path",
        required: true,
        type: "string",
        description: "Parameter without x-ms-client-name.",
      },
    ],
    {
      noClientName: {
        type: "string",
      },
    }
  )
  return linter.run(myOpenApiDocument).then((results) => {
    // Properties/parameters without x-ms-client-name should be filtered out by the given clause
    expect(results.length).toBe(0)
  })
})

test("XmsClientName: null property values are filtered by given clause", () => {
  const myOpenApiDocument = createOpenApiDoc([], {
    nullProperty: null,
    validProperty: {
      type: "string",
      "x-ms-client-name": "ValidName",
    },
  })
  return linter.run(myOpenApiDocument).then((results) => {
    // Null property should be filtered out by the given clause (@ != null check)
    // Only the valid property should pass through, and it's valid so 0 errors
    expect(results.length).toBe(0)
  })
})
