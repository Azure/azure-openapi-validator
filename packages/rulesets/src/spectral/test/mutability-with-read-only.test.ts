import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("MutabilityWithReadOnly")
  return linter
})

test("MutabilityWithReadOnly should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          operationId: "Path_Create",
          responses: {
            200: {
              description: "Success",
              schema: {
                $ref: "#/definitions/LroStatusCodeSchema",
              },
            },
          },
        },
      },
    },
    definitions: {
      LroStatusCodeSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            readOnly: true,
            "x-ms-mutability": ["read", "update"],
          },
          length: {
            type: "string",
            readOnly: false,
            "x-ms-mutability": ["read"],
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].message).toBe(
      `When property is modeled as "readOnly": true then x-ms-mutability extension can only have "read" value. When property is modeled as "readOnly": false then applying x-ms-mutability extension with only "read" value is not allowed. Extension contains invalid values: 'read'.`
    )
    expect(results[0].path.join(".")).toBe("paths./api/Paths.put.responses.200.schema.properties.length")
    expect(results[1].message).toBe(
      `When property is modeled as "readOnly": true then x-ms-mutability extension can only have "read" value. When property is modeled as "readOnly": false then applying x-ms-mutability extension with only "read" value is not allowed. Extension contains invalid values: 'read, update'.`
    )
    expect(results[1].path.join(".")).toBe("paths./api/Paths.put.responses.200.schema.properties.name")
  })
})

test("MutabilityWithReadOnly should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          operationId: "Path_Create",
          responses: {
            200: {
              description: "Success",
              schema: {
                $ref: "#/definitions/LroStatusCodeSchema",
              },
            },
          },
        },
      },
    },
    definitions: {
      LroStatusCodeSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            readOnly: true,
            "x-ms-mutability": ["read"],
          },
          length: {
            type: "string",
            readOnly: false,
            "x-ms-mutability": ["read", "update"],
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
