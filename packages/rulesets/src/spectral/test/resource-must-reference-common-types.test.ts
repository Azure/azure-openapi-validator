import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let nonResolvingLinter: Spectral
const RULE = "ResourceMustReferenceCommonTypes"

beforeAll(async () => {
  nonResolvingLinter = linterForRule(RULE, true)
  return nonResolvingLinter
})

// TODO: uncomment
// test(`${RULE} should find errors`, async () => {
//   const oasDoc = {
//     swagger: "2.0",
//     paths: {
//       "/providers/Microsoft.Bakery/breads/{breadName}": {
//         get: {
//           responses: {
//             200: {
//               description: "a response",
//               schema: {
//                 $ref: "#/definitions/Bread",
//               },
//             },
//           },
//         },
//         put: {
//           responses: {
//             200: {
//               description: "a response",
//               schema: {
//                 $ref: "#/definitions/Bread",
//               },
//             },
//           },
//         },
//       },
//     },
//     definitions: {
//       Bread: {
//         type: "object",
//         properties: {
//           name: {
//             description: "bread name",
//             type: "string",
//           },
//         },
//       },
//     },
//   }

//   return nonResolvingLinter.run(oasDoc).then((results) => {
//     expect(results.length).toBe(1)
//     expect(results[0].message).toBe(
//       "Resource definition 'Bread' must reference the common types resource definition for ProxyResource or TrackedResource."
//     )
//   })
// })

// test(`${RULE} should find no errors`, async () => {
//   const oasDoc = {
//     swagger: "2.0",
//     paths: {
//       "/providers/Microsoft.Bakery/breads/{breadName}": {
//         get: {
//           responses: {
//             200: {
//               description: "a response",
//               schema: {
//                 $ref: "#/definitions/Bread",
//               },
//             },
//           },
//         },
//         put: {
//           responses: {
//             200: {
//               description: "a response",
//               schema: {
//                 $ref: "#/definitions/Bread",
//               },
//             },
//           },
//         },
//       },
//     },
//     "/providers/Microsoft.Bakery/cookies/{cookieName}": {
//       get: {
//         responses: {
//           200: {
//             description: "a response",
//             schema: {
//               $ref: "#/definitions/Cookie",
//             },
//           },
//         },
//       },
//       put: {
//         responses: {
//           200: {
//             description: "a response",
//             schema: {
//               $ref: "#/definitions/Cookie",
//             },
//           },
//         },
//       },
//     },
//     definitions: {
//       Bread: {
//         type: "object",
//         properties: {
//           name: {
//             description: "bread name",
//             type: "string",
//           },
//           allOf: [
//             {
//               $ref: "../../../../../common-types/resource-management/v1/types.json#/definitions/ProxyResource",
//             },
//           ],
//         },
//       },
//     },
//     Cookie: {
//       type: "object",
//       properties: {
//         name: {
//           description: "cookie name",
//           type: "string",
//         },
//         allOf: [
//           {
//             $ref: "../../../../../common-types/resource-management/v1/types.json#/definitions/TrackedResource",
//           },
//         ],
//       },
//     },
//   }

//   return nonResolvingLinter.run(oasDoc).then((results) => {
//     expect(results.length).toBe(0)
//   })
// })

test(`${RULE} should find no errors`, async () => {
  // TODO: fix support for PrivateLinkAssociationGetResult
  const oasDoc = testData

  return nonResolvingLinter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})

const testData = {
  swagger: "2.0",
  info: {
    title: "ResourcePrivateLinkClient",
    version: "2023-03-01-preview",
    description: "Provides operations for managing private link resources",
  },
  host: "management.azure.com",
  schemes: ["https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  security: [
    {
      azure_auth: ["user_impersonation"],
    },
  ],
  securityDefinitions: {
    azure_auth: {
      type: "oauth2",
      authorizationUrl: "https://login.microsoftonline.com/common/oauth2/authorize",
      flow: "implicit",
      description: "Azure Active Directory OAuth2 Flow",
      scopes: {
        user_impersonation: "impersonate your user account",
      },
    },
  },
  paths: {
    "/providers/Microsoft.Management/managementGroups/{groupId}/providers/Microsoft.Authorization/privateLinkAssociations/{plaId}": {
      put: {
        tags: ["PrivateLinkAssociation"],
        operationId: "PrivateLinkAssociation_Put",
        description: "Create a PrivateLinkAssociation",
        parameters: [
          {
            $ref: "#/parameters/ApiVersionParameter",
          },
          {
            $ref: "#/parameters/GroupIdParameter",
          },
          {
            $ref: "#/parameters/PrivateLinkAssociationIdParameter",
          },
          {
            name: "parameters",
            in: "body",
            required: true,
            schema: {
              $ref: "#/definitions/PrivateLinkAssociationObject",
            },
            description: "Parameters supplied to create the private link association.",
          },
        ],
        responses: {
          "200": {
            description: "Ok - Returns information about the new private link association.",
            schema: {
              $ref: "#/definitions/PrivateLinkAssociation",
            },
          },
          "201": {
            description: "Created - Returns information about the new private link association.",
            schema: {
              $ref: "#/definitions/PrivateLinkAssociation",
            },
          },
          default: {
            description: "Error response describing why the operation failed.",
            schema: {
              $ref: "#/definitions/CloudError",
            },
          },
        },
        "x-ms-examples": {
          "Create a private link association, associate scope to rmpl.": {
            $ref: "./examples/PutPrivateLinkAssociation.json",
          },
        },
      },
      get: {
        tags: ["PrivateLinkAssociation"],
        operationId: "PrivateLinkAssociation_Get",
        description: "Get a single private link association",
        parameters: [
          {
            $ref: "#/parameters/ApiVersionParameter",
          },
          {
            $ref: "#/parameters/GroupIdParameter",
          },
          {
            $ref: "#/parameters/PrivateLinkAssociationIdParameter",
          },
        ],
        responses: {
          "200": {
            description: "Ok. The request has succeeded",
            schema: {
              $ref: "#/definitions/PrivateLinkAssociation",
            },
          },
          default: {
            description: "Error response describing why the operation failed.",
            schema: {
              $ref: "#/definitions/CloudError",
            },
          },
        },
        "x-ms-examples": {
          "Get a single private link association.": {
            $ref: "./examples/GetPrivateLinkAssociation.json",
          },
        },
      },
      delete: {
        tags: ["PrivateLinkAssociation"],
        operationId: "PrivateLinkAssociation_Delete",
        description: "Delete a PrivateLinkAssociation",
        parameters: [
          {
            $ref: "#/parameters/ApiVersionParameter",
          },
          {
            $ref: "#/parameters/GroupIdParameter",
          },
          {
            $ref: "#/parameters/PrivateLinkAssociationIdParameter",
          },
        ],
        responses: {
          "200": {
            description: "OK",
          },
          "204": {
            description: "",
          },
          default: {
            description: "Error response describing why the operation failed.",
            schema: {
              $ref: "#/definitions/CloudError",
            },
          },
        },
        "x-ms-examples": {
          "Delete a private link association.": {
            $ref: "./examples/DeletePrivateLinkAssociation.json",
          },
        },
      },
    },
    "/providers/Microsoft.Management/managementGroups/{groupId}/providers/Microsoft.Authorization/privateLinkAssociations": {
      get: {
        tags: ["PrivateLinkAssociation"],
        operationId: "PrivateLinkAssociation_List",
        description: "Get a private link association for a management group scope",
        parameters: [
          {
            $ref: "#/parameters/ApiVersionParameter",
          },
          {
            $ref: "#/parameters/GroupIdParameter",
          },
        ],
        responses: {
          "200": {
            description: "Ok. The request has succeeded",
            schema: {
              $ref: "#/definitions/PrivateLinkAssociationGetResult",
            },
          },
          default: {
            description: "Error response describing why the operation failed.",
            schema: {
              $ref: "#/definitions/CloudError",
            },
          },
        },
        "x-ms-examples": {
          "Get a private link association for a MG scope.": {
            $ref: "./examples/ListPrivateLinkAssociation.json",
          },
        },
      },
    },
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Authorization/resourceManagementPrivateLinks/{rmplName}":
      {
        put: {
          tags: ["ResourceManagementPrivateLink"],
          operationId: "ResourceManagementPrivateLink_Put",
          description: "Create a resource management group private link.",
          parameters: [
            {
              $ref: "#/parameters/SubscriptionIdParameter",
            },
            {
              name: "resourceGroupName",
              in: "path",
              required: true,
              type: "string",
              description: "The name of the resource group. The name is case insensitive.",
              minLength: 1,
              maxLength: 90,
            },
            {
              $ref: "#/parameters/ApiVersionParameter",
            },
            {
              $ref: "#/parameters/ResourceManagementPrivateLinkParameter",
            },
            {
              name: "parameters",
              in: "body",
              required: true,
              schema: {
                $ref: "#/definitions/ResourceManagementPrivateLinkLocation",
              },
              description: "The region to create the Resource Management private link.",
            },
          ],
          responses: {
            "200": {
              description: "OK. Returns information about the Resource Management Private Link.",
              schema: {
                $ref: "#/definitions/ResourceManagementPrivateLink",
              },
            },
            "201": {
              description: "Created. Returns information about the Resource Management Private Link.",
              schema: {
                $ref: "#/definitions/ResourceManagementPrivateLink",
              },
            },
            default: {
              description: "Error response describing why the operation failed.",
              schema: {
                $ref: "#/definitions/CloudError",
              },
            },
          },
          "x-ms-examples": {
            "Create Resource Management Private Link.": {
              $ref: "./examples/PutResourceManagementPrivateLink.json",
            },
          },
        },
        get: {
          tags: ["ResourceManagementPrivateLink"],
          operationId: "ResourceManagementPrivateLink_Get",
          description: "Get a resource management private link(resource-level).",
          parameters: [
            {
              $ref: "#/parameters/SubscriptionIdParameter",
            },
            {
              name: "resourceGroupName",
              in: "path",
              required: true,
              type: "string",
              description: "The name of the resource group. The name is case insensitive.",
              minLength: 1,
              maxLength: 90,
            },
            {
              $ref: "#/parameters/ApiVersionParameter",
            },
            {
              $ref: "#/parameters/ResourceManagementPrivateLinkParameter",
            },
          ],
          responses: {
            "200": {
              description: "Ok. Returns information about the resource management private link.",
              schema: {
                $ref: "#/definitions/ResourceManagementPrivateLink",
              },
            },
            default: {
              description: "Error response describing why the operation failed.",
              schema: {
                $ref: "#/definitions/CloudError",
              },
            },
          },
          "x-ms-examples": {
            "Get a Resource Management Private Link(resource-level).": {
              $ref: "./examples/GetResourceManagementPrivateLink.json",
            },
          },
        },
        patch: {
          tags: ["ResourceManagementPrivateLink"],
          operationId: "ResourceManagementPrivateLink_Update",
          description: "Update a resource management private link.",
          parameters: [
            {
              $ref: "#/parameters/SubscriptionIdParameter",
            },
            {
              name: "resourceGroupName",
              in: "path",
              required: true,
              type: "string",
              description: "The name of the resource group. The name is case insensitive.",
              minLength: 1,
              maxLength: 90,
            },
            {
              $ref: "#/parameters/ApiVersionParameter",
            },
            {
              $ref: "#/parameters/ResourceManagementPrivateLinkParameter",
            },
            {
              name: "parameters",
              in: "body",
              required: true,
              schema: {
                $ref: "#/definitions/ResourceManagementPrivateLinkPatch",
              },
              description: "Patch parameters for Resource Management private link.",
            },
          ],
          responses: {
            "200": {
              description: "OK. Returns information about the Resource Management Private Link.",
              schema: {
                $ref: "#/definitions/ResourceManagementPrivateLink",
              },
            },
            default: {
              description: "Error response describing why the operation failed.",
              schema: {
                $ref: "#/definitions/CloudError",
              },
            },
          },
          "x-ms-examples": {
            "Update Resource Management Private Link.": {
              $ref: "./examples/PatchResourceManagementPrivateLink.json",
            },
          },
        },
        delete: {
          tags: ["ResourceManagementPrivateLink"],
          operationId: "ResourceManagementPrivateLink_Delete",
          description: "Delete a resource management private link.",
          parameters: [
            {
              $ref: "#/parameters/SubscriptionIdParameter",
            },
            {
              name: "resourceGroupName",
              in: "path",
              required: true,
              type: "string",
              description: "The name of the resource group. The name is case insensitive.",
              minLength: 1,
              maxLength: 90,
            },
            {
              $ref: "#/parameters/ApiVersionParameter",
            },
            {
              $ref: "#/parameters/ResourceManagementPrivateLinkParameter",
            },
          ],
          responses: {
            "200": {
              description: "OK",
            },
            "204": {
              description: "",
            },
            default: {
              description: "Error response describing why the operation failed.",
              schema: {
                $ref: "#/definitions/CloudError",
              },
            },
          },
          "x-ms-examples": {
            "Delete a Resource Management Private Link.": {
              $ref: "./examples/DeleteResourceManagementPrivateLink.json",
            },
          },
        },
      },
    "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/resourceManagementPrivateLinks": {
      get: {
        tags: ["ResourceManagementPrivateLink"],
        operationId: "ResourceManagementPrivateLink_List",
        description: "Get all the resource management private links in a subscription.",
        parameters: [
          {
            $ref: "#/parameters/SubscriptionIdParameter",
          },
          {
            $ref: "#/parameters/ApiVersionParameter",
          },
        ],
        responses: {
          "200": {
            description: "Ok - Returns an array of private links.",
            schema: {
              $ref: "#/definitions/ResourceManagementPrivateLinkListResult",
            },
          },
          default: {
            description: "Error response describing why the operation failed.",
            schema: {
              $ref: "#/definitions/CloudError",
            },
          },
        },
        "x-ms-examples": {
          "Delete a Resource Management Private Link.": {
            $ref: "./examples/ListSubscriptionResourceManagementPrivateLink.json",
          },
        },
      },
    },
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Authorization/resourceManagementPrivateLinks": {
      get: {
        tags: ["ResourceManagementPrivateLink"],
        operationId: "ResourceManagementPrivateLink_ListByResourceGroup",
        description: "Get all the resource management private links in a resource group.",
        parameters: [
          {
            $ref: "#/parameters/SubscriptionIdParameter",
          },
          {
            name: "resourceGroupName",
            in: "path",
            required: true,
            type: "string",
            description: "The name of the resource group. The name is case insensitive.",
            minLength: 1,
            maxLength: 90,
          },
          {
            $ref: "#/parameters/ApiVersionParameter",
          },
        ],
        responses: {
          "200": {
            description: "Ok - Returns an array of private links.",
            schema: {
              $ref: "#/definitions/ResourceManagementPrivateLinkListResult",
            },
          },
          default: {
            description: "Error response describing why the operation failed.",
            schema: {
              $ref: "#/definitions/CloudError",
            },
          },
        },
        "x-ms-examples": {
          "Delete a Resource Management Private Link.": {
            $ref: "./examples/ListResourceGroupResourceManagementPrivateLink.json",
          },
        },
      },
    },
    "/providers/Microsoft.Authorization/enablePrivateLinkNetworkAccess": {
      post: {
        tags: ["EnablePrivateLinkNetworkAccess"],
        operationId: "EnablePrivateLinkNetworkAccess_Post",
        description: "Enable private link network access for global administrator",
        parameters: [
          {
            $ref: "#/parameters/ApiVersionParameter",
          },
          {
            name: "parameters",
            in: "body",
            required: true,
            schema: {
              $ref: "#/definitions/EnablePrivateLinkNetworkAccessObject",
            },
            description: "Parameters supplied to enable private link network access.",
          },
        ],
        responses: {
          "200": {
            description: "Post Succeed.",
          },
          "202": {
            description: "Accepted - Returns an Azure async operation header with HttpStatusCode 202.",
            headers: {
              "Azure-AsyncOperation": {
                type: "string",
              },
              Location: {
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
        "x-ms-long-running-operation": true,
        "x-ms-long-running-operation-options": {
          "final-state-via": "azure-async-operation",
        },
        "x-ms-examples": {
          "Enable a private link network access.": {
            $ref: "./examples/PostEnablePrivateLinkNetworkAccess.json",
          },
        },
      },
    },
    "/providers/Microsoft.Authorization/operations": {
      get: {
        tags: ["Operations"],
        operationId: "AuthorizationOperations_List",
        description: "Lists all of the available Microsoft.Authorization REST API operations.",
        parameters: [
          {
            $ref: "../../../../../common-types/resource-management/v2/types.json#/parameters/ApiVersionParameter",
          },
        ],
        responses: {
          "200": {
            description: "OK. The request has succeeded.",
            schema: {
              $ref: "../../../../../common-types/resource-management/v2/types.json#/definitions/OperationListResult",
            },
          },
          default: {
            description: "Error response describing why the operation failed.",
            schema: {
              $ref: "../../../../../common-types/resource-management/v2/types.json#/definitions/ErrorResponse",
            },
          },
        },
        "x-ms-pageable": {
          nextLinkName: "nextLink",
        },
        "x-ms-examples": {
          "List provider operations": {
            $ref: "./examples/ListProviderOperations.json",
          },
        },
      },
    },
  },
  definitions: {
    PrivateLinkAssociationObject: {
      type: "object",
      properties: {
        properties: {
          $ref: "#/definitions/PrivateLinkAssociationProperties",
          description: "The properties of the PrivateLinkAssociation.",
        },
      },
    },
    EnablePrivateLinkNetworkAccessObject: {
      type: "object",
      properties: {
        scope: {
          type: "string",
          description: "The scope of private link associations where network access is updated.",
        },
      },
    },
    PrivateLinkAssociationProperties: {
      type: "object",
      properties: {
        privateLink: {
          type: "string",
          description: "The rmpl Resource ID.",
        },
        publicNetworkAccess: {
          type: "string",
          enum: ["Enabled", "Disabled"],
          "x-ms-enum": {
            name: "publicNetworkAccessOptions",
            modelAsString: true,
          },
        },
      },
    },
    PrivateLinkAssociationGetResult: {
      description: "Result of the request to get PLA for a MG scope. ",
      type: "object",
      properties: {
        value: {
          type: "array",
          items: {
            $ref: "#/definitions/PrivateLinkAssociation",
          },
          description: "private link association information.",
        },
      },
    },
    PrivateLinkAssociationPropertiesExpanded: {
      type: "object",
      properties: {
        privateLink: {
          type: "string",
          description: "The rmpl Resource ID.",
        },
        publicNetworkAccess: {
          type: "string",
          enum: ["Enabled", "Disabled"],
          "x-ms-enum": {
            name: "publicNetworkAccessOptions",
            modelAsString: true,
          },
        },
        tenantID: {
          type: "string",
          description: "The TenantID.",
        },
        scope: {
          type: "string",
          description: "The scope of the private link association.",
        },
      },
      description: "Private Link Association Properties.",
    },
    PrivateLinkAssociation: {
      type: "object",
      allOf: [
        {
          $ref: "../../../../../common-types/resource-management/v2/types.json#/definitions/ProxyResource",
        },
      ],
      properties: {
        properties: {
          $ref: "#/definitions/PrivateLinkAssociationPropertiesExpanded",
          description: "The private link association properties.",
        },
        id: {
          readOnly: true,
          type: "string",
          description: "The plaResourceID.",
        },
        type: {
          readOnly: true,
          type: "string",
          description: "The operation type.",
        },
        name: {
          readOnly: true,
          type: "string",
          description: "The pla name.",
        },
      },
    },
    ResourceManagementPrivateLink: {
      type: "object",
      allOf: [
        {
          $ref: "../../../../../common-types/resource-management/v2/types.json#/definitions/ProxyResource",
        },
      ],
      properties: {
        properties: {
          $ref: "#/definitions/ResourceManagementPrivateLinkEndpointConnections",
        },
        id: {
          readOnly: true,
          type: "string",
          description: "The rmplResourceID.",
        },
        name: {
          readOnly: true,
          type: "string",
          description: "The rmpl Name.",
        },
        type: {
          readOnly: true,
          type: "string",
          description: "The operation type.",
        },
        location: {
          type: "string",
          description: "the region of the rmpl",
        },
        tags: {
          description: "The resource tags.",
          type: "object",
          additionalProperties: {
            type: "string",
          },
        },
      },
      "x-ms-azure-resource": true,
    },
    ResourceManagementPrivateLinkLocation: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "the region to create private link association.",
        },
      },
    },
    ResourceManagementPrivateLinkPatch: {
      type: "object",
      properties: {
        tags: {
          description: "Resource tags.",
          type: "object",
          additionalProperties: {
            type: "string",
            "x-nullable": true,
          },
        },
      },
    },
    ResourceManagementPrivateLinkEndpointConnections: {
      type: "object",
      properties: {
        privateEndpointConnections: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The private endpoint connections.",
        },
      },
    },
    ResourceManagementPrivateLinkListResult: {
      type: "object",
      properties: {
        value: {
          type: "array",
          items: {
            $ref: "#/definitions/ResourceManagementPrivateLink",
          },
          description: "An array of resource management private links.",
        },
      },
    },
    CloudError: {
      "x-ms-external": true,
      type: "object",
      properties: {
        error: {
          $ref: "../../../../../common-types/resource-management/v1/types.json#/definitions/ErrorResponse",
        },
      },
      description: "An error response for a resource management request.",
    },
  },
  parameters: {
    ApiVersionParameter: {
      name: "api-version",
      in: "query",
      required: true,
      type: "string",
      description: "The API version to use for this operation.",
      "x-ms-parameter-location": "client",
    },
    GroupIdParameter: {
      name: "groupId",
      in: "path",
      required: true,
      type: "string",
      description: "The management group ID.",
      "x-ms-parameter-location": "method",
      minLength: 1,
      maxLength: 90,
    },
    SubscriptionIdParameter: {
      name: "subscriptionId",
      in: "path",
      required: true,
      type: "string",
      description: "The ID of the target subscription.",
      "x-ms-parameter-location": "method",
    },
    PrivateLinkAssociationIdParameter: {
      name: "plaId",
      in: "path",
      required: true,
      type: "string",
      description: "The ID of the PLA",
      "x-ms-parameter-location": "method",
    },
    ResourceManagementPrivateLinkParameter: {
      name: "rmplName",
      in: "path",
      required: true,
      type: "string",
      description: "The name of the resource management private link.",
      "x-ms-parameter-location": "method",
    },
  },
}
