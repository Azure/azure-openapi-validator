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
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/My.NS/foo/{fooName}"
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
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/My.NS/foo/{fooName}"
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
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("ResourceNameRestriction should find errors for multiple methods and undefined parameters section", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkManagers/{networkManagerName}/networkGroups/{networkGroupName}":
        {
          parameters: [
            {
              $ref: "#/parameters/SubscriptionIdParameter",
            },
            {
              $ref: "#/parameters/ResourceGroupNameParameter",
            },
            {
              $ref: "#/parameters/NetworkManagerNameParameter",
            },
            {
              $ref: "#/parameters/NetworkGroupNameParameter",
            },
            {
              $ref: "#/parameters/ApiVersionParameter",
            },
          ],
          get: {
            tags: ["NetworkGroups"],
            operationId: "NetworkGroups_Get",
            description: "Gets the specified network group.",
            responses: {
              "200": {
                description: "OK - Returns information about the network group.",
                schema: {
                  $ref: "#/definitions/NetworkGroup",
                },
              },
              default: {
                description: "Error response describing why the operation failed.",
                schema: {
                  $ref: "#/definitions/CloudError",
                },
              },
            },
          },
          put: {
            tags: ["NetworkGroups"],
            operationId: "NetworkGroups_CreateOrUpdate",
            description: "Creates or updates a network group.",
            parameters: [
              {
                name: "parameters",
                in: "body",
                required: true,
                schema: {
                  $ref: "#/definitions/NetworkGroup",
                },
                description: "Parameters supplied to the specify which network group need to create",
              },
              {
                name: "If-Match",
                in: "header",
                required: false,
                type: "string",
                "x-ms-client-name": "IfMatch",
                description:
                  "The ETag of the transformation. Omit this value to always overwrite the current resource. Specify the last-seen ETag value to prevent accidentally overwriting concurrent changes.",
              },
            ],
            responses: {
              "200": {
                description: "Updated - Returns information about the network group.",
                schema: {
                  $ref: "#/definitions/NetworkGroup",
                },
                headers: {
                  ETag: {
                    description: "The current entity tag.",
                    type: "string",
                  },
                },
              },
              "201": {
                description: "Created - Returns information about the network group.",
                schema: {
                  $ref: "#/definitions/NetworkGroup",
                },
                headers: {
                  ETag: {
                    description: "The current entity tag.",
                    type: "string",
                  },
                },
              },
              default: {
                description: "Error response describing why the operation failed.",
                schema: {
                  $ref: "#/definitions/CloudError",
                },
              },
            },
          },
          delete: {
            tags: ["NetworkGroups"],
            operationId: "NetworkGroups_Delete",
            description: "Deletes a network group.",
            responses: {
              "200": {
                description: "Delete Succeed.",
              },
              "204": {
                description: "Request successful. The resource does not exist.",
              },
              default: {
                description: "Error response describing why the operation failed.",
                schema: {
                  $ref: "#/definitions/CloudError",
                },
              },
            },
          },
        },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkManagers/{networkManagerName}/networkGroups":
        {
          get: {
            tags: ["NetworkGroups"],
            operationId: "NetworkGroups_List",
            description: "Lists the specified network group.",
            "x-ms-pageable": {
              nextLinkName: "nextLink",
            },
            parameters: [
              {
                $ref: "#/parameters/SubscriptionIdParameter",
              },
              {
                $ref: "#/parameters/ResourceGroupNameParameter",
              },
              {
                $ref: "#/parameters/NetworkManagerNameParameter",
              },
              {
                $ref: "#/parameters/ApiVersionParameter",
              },
              {
                $ref: "#/parameters/ListTopParameter",
              },
              {
                $ref: "#/parameters/ListSkipTokenParameter",
              },
            ],
            responses: {
              "200": {
                description: "OK - Returns information about the network group.",
              },
              default: {
                description: "Error response describing why the operation failed.",
                schema: {
                  $ref: "#/definitions/CloudError",
                },
              },
            },
          },
        },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkManagers/{networkManagerName}/networkGroups/{networkGroupName}/listEffectiveVirtualNetworks":
        {
          post: {
            tags: ["NetworkGroups"],
            operationId: "EffectiveVirtualNetworks_ListByNetworkGroup",
            description: "Lists all effective virtual networks by specified network group.",
            parameters: [
              {
                $ref: "#/parameters/SubscriptionIdParameter",
              },
              {
                $ref: "#/parameters/ResourceGroupNameParameter",
              },
              {
                $ref: "#/parameters/NetworkManagerNameParameter",
              },
              {
                $ref: "#/parameters/NetworkGroupNameParameter",
              },
              {
                $ref: "#/parameters/ApiVersionParameter",
              },
              {
                name: "parameters",
                in: "body",
                required: true,
                schema: {
                  $ref: "#/definitions/QueryRequestOptions",
                },
                description: "Parameters supplied to list correct page.",
              },
            ],
            responses: {
              "200": {
                description: "OK - Returns information about the effective virtual networks.",
                schema: {
                  $ref: "#/definitions/EffectiveVirtualNetworksListResult",
                },
              },
              default: {
                description: "Error response describing why the operation failed.",
                schema: {
                  $ref: "#/definitions/CloudError",
                },
              },
            },
          },
        },
    },
    definitions: {
      CloudError: {
        "x-ms-external": true,
        properties: {
          error: {
            description: "Cloud error body.",
          },
        },
      },
      NetworkGroup: {
        properties: {
          properties: {
            "x-ms-client-flatten": true,
            $ref: "#/definitions/NetworkGroupProperties",
            description: "The Network Group properties",
          },
        },
        description: "The network group resource",
      },
      NetworkGroupListResult: {
        properties: {
          value: {
            type: "array",
            items: {
              $ref: "#/definitions/NetworkGroup",
            },
            description: "Gets a page of NetworkGroup",
          },
          nextLink: {
            type: "string",
            description: "Gets the URL to get the next set of results.",
          },
        },
        description:
          "Result of the request to list NetworkGroup. It contains a list of groups and a URL link to get the next set of results.",
      },
      NetworkGroupProperties: {
        type: "object",
        properties: {
          displayName: {
            type: "string",
            description: "A friendly name for the network group.",
          },
          description: {
            type: "string",
            description: "A description of the network group.",
          },
          memberType: {
            type: "string",
            description: "Group member type.",
          },
          groupMembers: {
            type: "array",
            items: {
              $ref: "#/definitions/groupMembersItem",
            },
            description: "Group members of network group.",
          },
          conditionalMembership: {
            type: "string",
            description: "Network group conditional filter.",
          },
        },
        description: "Properties of network group",
      },
      groupMembersItem: {
        type: "object",
        properties: {
          resourceId: {
            type: "string",
            description: "Resource Id.",
          },
        },
        description: "GroupMembers Item.",
      },
      QueryRequestOptions: {
        properties: {
          skipToken: {
            description:
              "When present, the value can be passed to a subsequent query call (together with the same query and scopes used in the current request) to retrieve the next page of data.",
            type: "string",
          },
        },
        description: "Query Request Options",
      },
      EffectiveVirtualNetworksListResult: {
        properties: {
          value: {
            type: "array",
            items: {
              $ref: "#/definitions/EffectiveVirtualNetwork",
            },
            description: "Gets a page of EffectiveVirtualNetwork",
          },
          skipToken: {
            description:
              "When present, the value can be passed to a subsequent query call (together with the same query and scopes used in the current request) to retrieve the next page of data.",
            type: "string",
          },
        },
        description:
          "Result of the request to list Effective Virtual Network. It contains a list of groups and a URL link to get the next set of results.",
      },
      EffectiveVirtualNetwork: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Effective vnet Id.",
          },
          location: {
            type: "string",
            description: "Location of vnet.",
          },
          membershipType: {
            type: "string",
            description: "Membership Type.",
            enum: ["Static", "Dynamic"],
            "x-ms-enum": {
              name: "MembershipType",
              modelAsString: true,
            },
          },
        },
        description: "Effective Virtual Network",
      },
    },
    parameters: {
      SubscriptionIdParameter: {
        name: "subscriptionId",
        in: "path",
        required: true,
        type: "string",
        description:
          "The subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.",
      },
      ApiVersionParameter: {
        name: "api-version",
        in: "query",
        required: true,
        type: "string",
        description: "Client API version.",
      },
      ResourceGroupNameParameter: {
        name: "resourceGroupName",
        in: "path",
        required: true,
        type: "string",
        description: "The name of the resource group.",
        "x-ms-parameter-location": "method",
      },
      NetworkManagerNameParameter: {
        name: "networkManagerName",
        in: "path",
        required: true,
        type: "string",
        description: "The name of the network manager.",
        "x-ms-parameter-location": "method",
      },
      NetworkGroupNameParameter: {
        name: "networkGroupName",
        in: "path",
        required: true,
        type: "string",
        description: "The name of the network group to get.",
        "x-ms-parameter-location": "method",
      },
      ListTopParameter: {
        name: "$top",
        description: "An optional query parameter which specifies the maximum number of records to be returned by the server.",
        in: "query",
        required: false,
        type: "integer",
        format: "int32",
        minimum: 1,
        maximum: 20,
        "x-ms-parameter-location": "method",
      },
      ListSkipTokenParameter: {
        name: "$skipToken",
        description:
          "SkipToken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skipToken parameter that specifies a starting point to use for subsequent calls.",
        in: "query",
        required: false,
        type: "string",
        "x-ms-parameter-location": "method",
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(5)
    expect(results[0].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkManagers/{networkManagerName}/networkGroups/{networkGroupName}"
    )
    expect(results[0].message).toContain("The resource name parameter 'networkManagerName' should be defined with a 'pattern' restriction.")
    expect(results[1].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkManagers/{networkManagerName}/networkGroups/{networkGroupName}"
    )
    expect(results[1].message).toContain("The resource name parameter 'networkGroupName' should be defined with a 'pattern' restriction.")
    expect(results[2].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkManagers/{networkManagerName}/networkGroups"
    )
    expect(results[2].message).toContain("The resource name parameter 'networkManagerName' should be defined with a 'pattern' restriction.")
    expect(results[3].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkManagers/{networkManagerName}/networkGroups/{networkGroupName}/listEffectiveVirtualNetworks"
    )
    expect(results[3].message).toContain("The resource name parameter 'networkManagerName' should be defined with a 'pattern' restriction.")
    expect(results[4].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkManagers/{networkManagerName}/networkGroups/{networkGroupName}/listEffectiveVirtualNetworks"
    )
    expect(results[4].message).toContain("The resource name parameter 'networkGroupName' should be defined with a 'pattern' restriction.")
  })
})
