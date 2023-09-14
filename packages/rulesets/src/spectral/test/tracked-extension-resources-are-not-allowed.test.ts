import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("trackedExtensionResourcesAreNotAllowed")
  return linter
})

test("trackedExtensionResourcesAreNotAllowed should find errors for tracked extension resources", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/{resourceUri}/providers/Microsoft.EdgeProvisioning/deviceProvisioningStates": {
        get: {
          operationId: "DeviceProvisioningStates_List",
          tags: ["DeviceProvisioningStates"],
          description: "List DeviceProvisioningState resources by parent",
          parameters: [
            {
              name: "api-version",
              in: "query",
              required: true,
              type: "string",
              description: "Client Api Version.",
              enum: ["2020-06-01"],
            },
          ],
          responses: {
            "200": {
              description: "ARM operation completed successfully.",
              schema: {
                $ref: "#/definitions/DeviceProvisioningStateListResult",
              },
            },
            default: {
              description: "An unexpected error response.",
              schema: {
                $ref: "#/definitions/ErrorResponse",
              },
            },
          },
          "x-ms-examples": null,
          "x-ms-pageable": {
            nextLinkName: "nextLink",
          },
        },
      },
      "/{resourceUri}/providers/Microsoft.EdgeProvisioning/deviceProvisioningStates/default": {
        get: {
          operationId: "DeviceProvisioningStates_Get",
          tags: ["DeviceProvisioningStates"],
          description: "Get a DeviceProvisioningState",
          parameters: [
            {
              name: "api-version",
              in: "query",
              required: true,
              type: "string",
              description: "Client Api Version.",
              enum: ["2020-06-01"],
            },
          ],
          responses: {
            "200": {
              description: "ARM operation completed successfully.",
              schema: {
                $ref: "#/definitions/DeviceProvisioningState",
              },
            },
            default: {
              description: "An unexpected error response.",
              schema: {
                $ref: "#/definitions/ErrorResponse",
              },
            },
          },
          "x-ms-examples": null,
        },
        put: {
          operationId: "DeviceProvisioningStates_CreateOrUpdate",
          tags: ["DeviceProvisioningStates"],
          description: "Create a DeviceProvisioningState",
          parameters: [
            {
              name: "api-version",
              in: "query",
              required: true,
              type: "string",
              description: "Client Api Version.",
              enum: ["2020-06-01"],
            },
            {
              name: "resource",
              in: "body",
              description: "Resource create parameters.",
              required: true,
              schema: {
                $ref: "#/definitions/DeviceProvisioningState",
              },
            },
          ],
          responses: {
            "200": {
              description: "Resource create or update operation completed successfully.",
              schema: {
                $ref: "#/definitions/DeviceProvisioningStateListResult",
              },
            },
            "201": {
              description: "ARM create operation completed successfully.",
              schema: {
                $ref: "#/definitions/DeviceProvisioningState",
              },
              headers: {
                "Retry-After": {
                  type: "integer",
                  format: "int32",
                  description: "The Retry-After header can indicate how long the client should wait before polling the operation status.",
                },
              },
            },
            default: {
              description: "An unexpected error response.",
              schema: {
                $ref: "#/definitions/ErrorResponse",
              },
            },
          },
          "x-ms-examples": null,
          "x-ms-long-running-operation-options": {
            "final-state-via": "azure-async-operation",
          },
          "x-ms-long-running-operation": true,
        },
      },
    },
    definitions: {
      ErrorResponse: {
        title: "Error response",
        description:
          "Common error response for all Azure Resource Manager APIs to return error details for failed operations. (This also follows the OData error response format.).",
        type: "object",
        properties: {
          error: {
            description: "The error object.",
          },
        },
      },
      DeviceProvisioningState: {
        type: "object",
        description: "The provisioning state of a device.",
        properties: {
          properties: {
            location: {
              type: "string",
            },
            description: "The resource-specific properties for this resource.",
            "x-ms-client-flatten": true,
            "x-ms-mutability": ["read", "create"],
          },
        },
      },
      DeviceProvisioningStateListResult: {
        type: "object",
        description: "The response of a DeviceProvisioningState list operation.",
        properties: {
          value: {
            type: "array",
            description: "The DeviceProvisioningState items on this page",
            items: {
              $ref: "#/definitions/DeviceProvisioningState",
            },
          },
          nextLink: {
            type: "string",
            format: "uri",
            description: "The link to the next page of items",
          },
        },
        required: ["value"],
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].path.join(".")).toBe("paths./{resourceUri}/providers/Microsoft.EdgeProvisioning/deviceProvisioningStates/default.get")
    expect(results[0].message).toContain("Extension resources of type tracked are not allowed.")
    expect(results[1].path.join(".")).toBe("paths./{resourceUri}/providers/Microsoft.EdgeProvisioning/deviceProvisioningStates/default.put")
    expect(results[1].message).toContain("Extension resources of type tracked are not allowed.")
  })
})

test("trackedExtensionResourcesAreNotAllowed should not find errors for non tracked extension resources", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/{resourceUri}/providers/Microsoft.EdgeProvisioning/deviceProvisioningStates": {
        get: {
          operationId: "DeviceProvisioningStates_List",
          tags: ["DeviceProvisioningStates"],
          description: "List DeviceProvisioningState resources by parent",
          parameters: [
            {
              name: "api-version",
              in: "query",
              required: true,
              type: "string",
              description: "Client Api Version.",
              enum: ["2020-06-01"],
            },
          ],
          responses: {
            "200": {
              description: "ARM operation completed successfully.",
              schema: {
                $ref: "#/definitions/DeviceProvisioningStateListResult",
              },
            },
            default: {
              description: "An unexpected error response.",
              schema: {
                $ref: "#/definitions/ErrorResponse",
              },
            },
          },
          "x-ms-examples": null,
          "x-ms-pageable": {
            nextLinkName: "nextLink",
          },
        },
      },
      "/{resourceUri}/providers/Microsoft.EdgeProvisioning/deviceProvisioningStates/default": {
        get: {
          operationId: "DeviceProvisioningStates_Get",
          tags: ["DeviceProvisioningStates"],
          description: "Get a DeviceProvisioningState",
          parameters: [
            {
              name: "api-version",
              in: "query",
              required: true,
              type: "string",
              description: "Client Api Version.",
              enum: ["2020-06-01"],
            },
          ],
          responses: {
            "200": {
              description: "ARM operation completed successfully.",
              schema: {
                $ref: "#/definitions/DeviceProvisioningState",
              },
            },
            default: {
              description: "An unexpected error response.",
              schema: {
                $ref: "#/definitions/ErrorResponse",
              },
            },
          },
          "x-ms-examples": null,
        },
        put: {
          operationId: "DeviceProvisioningStates_CreateOrUpdate",
          tags: ["DeviceProvisioningStates"],
          description: "Create a DeviceProvisioningState",
          parameters: [
            {
              name: "api-version",
              in: "query",
              required: true,
              type: "string",
              description: "Client Api Version.",
              enum: ["2020-06-01"],
            },
            {
              name: "resource",
              in: "body",
              description: "Resource create parameters.",
              required: true,
              schema: {
                $ref: "#/definitions/DeviceProvisioningState",
              },
            },
          ],
          responses: {
            "200": {
              description: "Resource create or update operation completed successfully.",
              schema: {
                $ref: "#/definitions/DeviceProvisioningStateListResult",
              },
            },
            "201": {
              description: "ARM create operation completed successfully.",
              schema: {
                $ref: "#/definitions/DeviceProvisioningState",
              },
              headers: {
                "Retry-After": {
                  type: "integer",
                  format: "int32",
                  description: "The Retry-After header can indicate how long the client should wait before polling the operation status.",
                },
              },
            },
            default: {
              description: "An unexpected error response.",
              schema: {
                $ref: "#/definitions/ErrorResponse",
              },
            },
          },
          "x-ms-examples": null,
          "x-ms-long-running-operation-options": {
            "final-state-via": "azure-async-operation",
          },
          "x-ms-long-running-operation": true,
        },
      },
    },
    definitions: {
      ErrorResponse: {
        title: "Error response",
        description:
          "Common error response for all Azure Resource Manager APIs to return error details for failed operations. (This also follows the OData error response format.).",
        type: "object",
        properties: {
          error: {
            description: "The error object.",
          },
        },
      },
      DeviceProvisioningState: {
        type: "object",
        description: "The provisioning state of a device.",
        properties: {
          properties: {
            description: "The resource-specific properties for this resource.",
            "x-ms-client-flatten": true,
            "x-ms-mutability": ["read", "create"],
          },
        },
      },
      DeviceProvisioningStateListResult: {
        type: "object",
        description: "The response of a DeviceProvisioningState list operation.",
        properties: {
          value: {
            type: "array",
            description: "The DeviceProvisioningState items on this page",
            items: {
              $ref: "#/definitions/DeviceProvisioningState",
            },
          },
          nextLink: {
            type: "string",
            format: "uri",
            description: "The link to the next page of items",
          },
        },
        required: ["value"],
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("trackedExtensionResourcesAreNotAllowed should not find errors for tracked non-extension resources", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/subscription/{subId}/providers/Microsoft.EdgeProvisioning/deviceProvisioningStates": {
        get: {
          operationId: "DeviceProvisioningStates_List",
          tags: ["DeviceProvisioningStates"],
          description: "List DeviceProvisioningState resources by parent",
          parameters: [
            {
              name: "api-version",
              in: "query",
              required: true,
              type: "string",
              description: "Client Api Version.",
              enum: ["2020-06-01"],
            },
          ],
          responses: {
            "200": {
              description: "ARM operation completed successfully.",
              schema: {
                $ref: "#/definitions/DeviceProvisioningStateListResult",
              },
            },
            default: {
              description: "An unexpected error response.",
              schema: {
                $ref: "#/definitions/ErrorResponse",
              },
            },
          },
          "x-ms-examples": null,
          "x-ms-pageable": {
            nextLinkName: "nextLink",
          },
        },
      },
      "/subscription/{subId}/providers/Microsoft.EdgeProvisioning/deviceProvisioningStates/default": {
        get: {
          operationId: "DeviceProvisioningStates_Get",
          tags: ["DeviceProvisioningStates"],
          description: "Get a DeviceProvisioningState",
          parameters: [
            {
              name: "api-version",
              in: "query",
              required: true,
              type: "string",
              description: "Client Api Version.",
              enum: ["2020-06-01"],
            },
          ],
          responses: {
            "200": {
              description: "ARM operation completed successfully.",
              schema: {
                $ref: "#/definitions/DeviceProvisioningState",
              },
            },
            default: {
              description: "An unexpected error response.",
              schema: {
                $ref: "#/definitions/ErrorResponse",
              },
            },
          },
          "x-ms-examples": null,
        },
        put: {
          operationId: "DeviceProvisioningStates_CreateOrUpdate",
          tags: ["DeviceProvisioningStates"],
          description: "Create a DeviceProvisioningState",
          parameters: [
            {
              name: "api-version",
              in: "query",
              required: true,
              type: "string",
              description: "Client Api Version.",
              enum: ["2020-06-01"],
            },
            {
              name: "resource",
              in: "body",
              description: "Resource create parameters.",
              required: true,
              schema: {
                $ref: "#/definitions/DeviceProvisioningState",
              },
            },
          ],
          responses: {
            "200": {
              description: "Resource create or update operation completed successfully.",
              schema: {
                $ref: "#/definitions/DeviceProvisioningStateListResult",
              },
            },
            "201": {
              description: "ARM create operation completed successfully.",
              schema: {
                $ref: "#/definitions/DeviceProvisioningState",
              },
              headers: {
                "Retry-After": {
                  type: "integer",
                  format: "int32",
                  description: "The Retry-After header can indicate how long the client should wait before polling the operation status.",
                },
              },
            },
            default: {
              description: "An unexpected error response.",
              schema: {
                $ref: "#/definitions/ErrorResponse",
              },
            },
          },
          "x-ms-examples": null,
          "x-ms-long-running-operation-options": {
            "final-state-via": "azure-async-operation",
          },
          "x-ms-long-running-operation": true,
        },
      },
    },
    definitions: {
      ErrorResponse: {
        title: "Error response",
        description:
          "Common error response for all Azure Resource Manager APIs to return error details for failed operations. (This also follows the OData error response format.).",
        type: "object",
        properties: {
          error: {
            description: "The error object.",
          },
        },
      },
      DeviceProvisioningState: {
        type: "object",
        description: "The provisioning state of a device.",
        properties: {
          properties: {
            location: {
              type: "string",
            },
            description: "The resource-specific properties for this resource.",
            "x-ms-client-flatten": true,
            "x-ms-mutability": ["read", "create"],
          },
        },
      },
      DeviceProvisioningStateListResult: {
        type: "object",
        description: "The response of a DeviceProvisioningState list operation.",
        properties: {
          value: {
            type: "array",
            description: "The DeviceProvisioningState items on this page",
            items: {
              $ref: "#/definitions/DeviceProvisioningState",
            },
          },
          nextLink: {
            type: "string",
            format: "uri",
            description: "The link to the next page of items",
          },
        },
        required: ["value"],
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
