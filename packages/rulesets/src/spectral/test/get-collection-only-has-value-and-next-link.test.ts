import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("GetCollectionOnlyHasValueAndNextLink")
  return linter
})

test("GetCollectionOnlyHasValueAndNextLink should find no errors when get collection schema has only value and nextLink properties", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/dnsZones/{zoneName}/dnssecConfigs/default":
        {
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
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/dnsZones/{zoneName}/dnssecConfigs/operations":
        {
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
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/dnsZones/{zoneName}/dnssecConfigs/anystring":
        {
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
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/dnsZones/{zoneName}/dnssecConfigs/Microsoft.Other/otherZones/{otherzoneName}/otherdnssec/anystring":
        {
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
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/dnsZones/{zoneName}/dnssecConfigs/{dnssecConfigsName}":
        {
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
          nextLink1: {
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

test("GetCollectionOnlyHasValueAndNextLink should find errors when get collection schema has properties other than value and nextLink", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/dnsZones/{zoneName}/dnssecConfigs": {
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
    expect(results[0].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/dnsZones/{zoneName}/dnssecConfigs.get.responses.200.schema.properties"
    )
    expect(results[0].message).toBe(
      "Get endpoints for collections of resources must only have the `value` and `nextLink` properties in their model."
    )
  })
})

test("GetCollectionOnlyHasValueAndNextLink should find errors when get collection schema has two provider namespaces", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/dnsZones/{zoneName}/dnssecConfigs/Microsoft.Other/otherZones/{otherzoneName}/otherdnssec":
        {
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
    expect(results[0].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/dnsZones/{zoneName}/dnssecConfigs/Microsoft.Other/otherZones/{otherzoneName}/otherdnssec.get.responses.200.schema.properties"
    )
    expect(results[0].message).toBe(
      "Get endpoints for collections of resources must only have the `value` and `nextLink` properties in their model."
    )
  })
})

test("GetCollectionOnlyHasValueAndNextLink should find errors when nextLink is missing", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/dnsZones/{zoneName}/dnssecConfigs": {
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
    expect(results[0].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/dnsZones/{zoneName}/dnssecConfigs.get.responses.200.schema.properties"
    )
    expect(results[0].message).toBe(
      "Get endpoints for collections of resources must only have the `value` and `nextLink` properties in their model."
    )
  })
})

test("GetCollectionOnlyHasValueAndNextLink should find errors when value is missing", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/dnsZones/{zoneName}/dnssecConfigs": {
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
    expect(results[0].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/dnsZones/{zoneName}/dnssecConfigs.get.responses.200.schema.properties"
    )
    expect(results[0].message).toBe(
      "Get endpoints for collections of resources must only have the `value` and `nextLink` properties in their model."
    )
  })
})
