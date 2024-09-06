import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("ResourceNameRestriction")
  return linter
})

test("ResourceNameRestriction should find errors on path level", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/My.NS/foo/{fooName}": {
        parameters: [
          {
            name: "fooName",
            in: "path",
            required: true,
            type: "string",
            "x-ms-parameter-location": "method",
          },
        ],
        get: {
          parameters: [],
          responses: {},
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/My.NS/foo/{fooName}",
    )
    expect(results[0].message).toContain("The resource name parameter 'fooName' should be defined with a 'pattern' restriction.")
  })
})

test("ResourceNameRestriction should find errors on operation level", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/My.NS/foo/{fooName}": {
        get: {
          parameters: [
            {
              name: "fooName",
              in: "path",
              required: true,
              type: "string",
              "x-ms-parameter-location": "method",
            },
          ],
          responses: {},
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/My.NS/foo/{fooName}",
    )
    expect(results[0].message).toContain("The resource name parameter 'fooName' should be defined with a 'pattern' restriction.")
  })
})

test("ResourceNameRestriction should find no errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/My.NS/foo/{fooName}": {
        parameters: [
          {
            name: "fooName",
            in: "path",
            required: true,
            type: "string",
            pattern: "[a-zA-Z_0-9]+",
            "x-ms-parameter-location": "method",
          },
        ],
        get: {
          parameters: [],
          responses: {},
        },
      },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/My.NS/bar/{barName}": {
        parameters: [
          {
            name: "fooName",
            in: "path",
            required: true,
            type: "string",
            pattern: "[a-zA-Z_0-9]+",
            "x-ms-parameter-location": "method",
          },
        ],
        get: {
          responses: {},
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("ResourceNameRestriction should find no errors for system-defined variables", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/My.NS/foo/{fooName}/privateEndpointConnections/{privateEndpointConnectionName}":
        {
          parameters: [
            {
              name: "fooName",
              in: "path",
              required: true,
              type: "string",
              pattern: "[a-zA-Z_0-9]+",
              "x-ms-parameter-location": "method",
            },
            {
              name: "privateEndpointConnectionName",
              in: "path",
              required: true,
              type: "string",
              description: "The name of the private endpoint connection associated with the Azure resource.",
              "x-ms-parameter-location": "method",
            },
          ],
          get: {
            parameters: [],
            responses: {},
          },
        },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/My.NS/foo/{fooName}/networkSecurityPerimeterConfiguration/{networkSecurityPerimeterConfigurationName}":
        {
          parameters: [
            {
              name: "fooName",
              in: "path",
              required: true,
              type: "string",
              pattern: "[a-zA-Z_0-9]+",
              "x-ms-parameter-location": "method",
            },
            {
              name: "networkSecurityPerimeterConfigurationName",
              in: "path",
              required: true,
              type: "string",
              description: "The name of the network security perimeter configuration associated with the Azure resource.",
              "x-ms-parameter-location": "method",
            },
          ],
          get: {
            parameters: [],
            responses: {},
          },
        },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("ResourceNameRestriction should find no errors for type enums", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/providers/Microsoft.AzurePlaywrightService/locations/{location}/quotas/{quotaName}": {
        get: {
          operationId: "Quotas_Get",
          tags: ["Quotas"],
          description: "Get quota by name.",
          parameters: [
            {
              name: "location",
              in: "path",
              description: "The location of quota in ARM Normalized format like eastus, southeastasia etc.",
              required: true,
              type: "string",
            },
            {
              name: "quotaName",
              in: "path",
              description: "The quota name.",
              required: true,
              type: "string",
              enum: ["ScalableExecution", "Reporting"],
            },
          ],
          responses: {},
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
