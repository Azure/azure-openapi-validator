import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("AvoidNestedProperties")
  return linter
})

test("AvoidNestedProperties should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    info: {
      description:
        "Use these APIs to manage Azure Websites resources through the Azure Resource Manager. All task operations conform to the HTTP/1.1 protocol specification and each operation returns an x-ms-request-id header that can be used to obtain information about the request. You must make sure that requests made to these resources are secure. For more information, see https://msdn.microsoft.com/en-us/library/azure/dn790557.aspx.",
    },
    definitions: {
      externalDocs: {
        type: "object",
        properties: {
          tags: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "Resource tags.",
          },
          properties: {
            type: "object",
            properties: {
              timeOfDayUTC: {
                type: "string",
                pattern: "^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$",
                description: "The time of day (in UTC) to start the maintenance window.",
              },
            },
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
  })
})

test("AvoidNestedProperties should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    info: {
      description:
        "Use these APIs to manage Azure Websites resources through the Azure Resource Manager. All task operations conform to the HTTP/1.1 protocol specification and each operation returns an x-ms-request-id header that can be used to obtain information about the request. You must make sure that requests made to these resources are secure. For more information, see https://msdn.microsoft.com/en-us/library/azure/dn790557.aspx.",
    },
    definitions: {
      externalDocs: {
        properties: {
          properties: {
            type: "object",
            "x-ms-client-flatten": true,
            $ref: "#/definitions/BackendProperties",
          },
        },
      },
      BackendProperties: {
        properties: {
          $ref: "#/definitions/externalDocs",
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("AvoidNestedProperties should find errors when the extension is specified outside the complex type definition", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    info: {
      description:
        "Use these APIs to manage Azure Websites resources through the Azure Resource Manager. All task operations conform to the HTTP/1.1 protocol specification and each operation returns an x-ms-request-id header that can be used to obtain information about the request. You must make sure that requests made to these resources are secure. For more information, see https://msdn.microsoft.com/en-us/library/azure/dn790557.aspx.",
    },
    definitions: {
      externalDocs: {
        type: "object",
        properties: {
          tags: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "Resource tags.",
          },
          properties: {
            type: "object",
            properties: {
              "x-ms-client-flatten": true,
              timeOfDayUTC: {
                type: "string",
                pattern: "^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$",
                description: "The time of day (in UTC) to start the maintenance window.",
              },
            },
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
  })
})

test("AvoidNestedProperties should not find errors when the extension is specified for a complex type definition", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    info: {
      description:
        "Use these APIs to manage Azure Websites resources through the Azure Resource Manager. All task operations conform to the HTTP/1.1 protocol specification and each operation returns an x-ms-request-id header that can be used to obtain information about the request. You must make sure that requests made to these resources are secure. For more information, see https://msdn.microsoft.com/en-us/library/azure/dn790557.aspx.",
    },
    definitions: {
      externalDocs: {
        type: "object",
        properties: {
          tags: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "Resource tags.",
          },
          properties: {
            type: "object",
            "x-ms-client-flatten": true,
            properties: {
              timeOfDayUTC: {
                type: "string",
                pattern: "^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$",
                description: "The time of day (in UTC) to start the maintenance window.",
              },
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
