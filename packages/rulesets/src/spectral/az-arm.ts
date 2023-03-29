import { oas2 } from "@stoplight/spectral-formats"
import { falsy, pattern, truthy } from "@stoplight/spectral-functions"
import common from "./az-common"
import verifyArmPath from "./functions/arm-path-validation"
import bodyParamRepeatedInfo from "./functions/body-param-repeated-info"
import { camelCase } from "./functions/camel-case"
import collectionObjectPropertiesNaming from "./functions/collection-object-properties-naming"
import { consistentPatchProperties } from "./functions/consistent-patch-properties"
import { longRunningResponseStatusCodeArm } from "./functions/Extensions/long-running-response-status-code"
import hasApiVersionParameter from "./functions/has-api-version-parameter"
import hasheader from "./functions/has-header"
import httpsSupportedScheme from "./functions/https-supported-scheme"
import locationMustHaveXmsMutability from "./functions/location-must-have-xms-mutability"
import validateOriginalUri from "./functions/lro-original-uri"
import { lroPatch202 } from "./functions/lro-patch-202"
import { lroPostReturn } from "./functions/lro-post-return"
import provisioningStateSpecified from "./functions/lro-provisioning-state-specified"
import noDuplicatePathsForScopeParameter from "./functions/no-duplicate-paths-for-scope-parameter"
import operationsApiSchema from "./functions/operations-api-schema"
import { parameterNotDefinedInGlobalParameters } from "./functions/parameter-not-defined-in-global-parameters"
import { parameterNotUsingCommonTypes } from "./functions/parameter-not-using-common-types"
import { ParametersInPost } from "./functions/parameters-in-post"
import pathBodyParameters from "./functions/patch-body-parameters"
import { PatchResponseCode } from "./functions/patch-response-code"
import pathSegmentCasing from "./functions/path-segment-casing"
import provisioningState from "./functions/provisioning-state"
import putGetPatchScehma from "./functions/put-get-patch-schema"
import { PutResponseSchemaDescription } from "./functions/put-response-schema-description"
import resourceNameRestriction from "./functions/resource-name-restriction"
import responseSchemaSpecifiedForSuccessStatusCode from "./functions/response-schema-specified-for-success-status-code"
import { securityDefinitionsStructure } from "./functions/security-definitions-structure"
import skuValidation from "./functions/sku-validation"
import { SyncPostReturn } from "./functions/synchronous-post-return"
import trackedResourceTagsPropertyInRequest from "./functions/trackedresource-tags-property-in-request"
import { validatePatchBodyParamProperties } from "./functions/validate-patch-body-param-properties"
import withXmsResource from "./functions/with-xms-resource"
import { noErrorCodeResponses } from "./functions/no-error-code-responses"
const ruleset: any = {
  extends: [common],
  rules: {
    ApiHost: {
      description: "The host is required for management plane specs.",
      message: "{{description}}",
      severity: "error",
      resolved: false,
      formats: [oas2],
      given: ["$.host"],
      then: {
        function: truthy,
      },
    },
    SubscriptionsAndResourceGroupCasing: {
      description: "The subscriptions and resourceGroup in resource uri should follow lower camel case.",
      message: "{{error}}",
      severity: "error",
      resolved: false,
      formats: [oas2],
      given: ["$.paths", "$.x-ms-paths"],
      then: {
        function: pathSegmentCasing,
        functionOptions: {
          segments: ["resourceGroups", "subscriptions"],
        },
      },
    },

    ///
    /// ARM RPC rules for Async patterns
    ///

    // RPC Code: RPC-Async-V1-01
    LongRunningResponseStatusCode: {
      description: 'A LRO Post operation with return schema must have "x-ms-long-running-operation-options" extension enabled.',
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'x-ms-long-running-operation' && @ === true)]^^"],
      then: {
        function: longRunningResponseStatusCodeArm,
      },
    },
    // RPC Code: RPC-Async-V1-02
    ProvisioningStateSpecified: {
      description: 'A LRO PUT and PATCH operations response schema must have "ProvisioningState" property specified.',
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: "$[paths,'x-ms-paths'].*[put,patch].[?(@property === 'x-ms-long-running-operation' && @ === true)]^^",
      then: {
        function: provisioningStateSpecified,
      },
    },
    // https://github.com/Azure/azure-openapi-validator/issues/332
    // RPC Code: RPC-Async-V1-03
    ProvisioningStateValidation: {
      description: "ProvisioningState must have terminal states: Succeeded, Failed and Canceled.",
      message: "{{error}}",
      severity: "error",
      resolved: false,
      formats: [oas2],
      given: ["$.definitions..provisioningState[?(@property === 'enum')]^", "$.definitions..ProvisioningState[?(@property === 'enum')]^"],
      then: {
        function: provisioningState,
      },
    },
    // x-ms-long-running-operation-options should indicate the type of response header to track the async operation
    //https://github.com/Azure/azure-openapi-validator/issues/324
    // RPC Code: RPC-Async-V1-06
    XmsLongRunningOperationOptions: {
      description:
        "The x-ms-long-running-operation-options should be specified explicitly to indicate the type of response header to track the async operation.",
      message: "{{description}}",
      severity: "warn",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'x-ms-long-running-operation' && @ === true)]^"],
      then: {
        field: "x-ms-long-running-operation-options",
        function: truthy,
      },
    },
    // RPC Code: RPC-Async-V1-07
    LroLocationHeader: {
      description: "Location header must be supported for all async operations that return 202.",
      message: "A 202 response should include an Location response header.",
      severity: "error",
      formats: [oas2],
      given: "$.paths[*][*].responses[?(@property == '202')]",
      then: {
        function: hasheader,
        functionOptions: {
          name: "Location",
        },
      },
    },
    // RPC Code: RPC-Common-V1-05
    LroErrorContent: {
      description:
        "Error response content of long running operations must follow the error schema provided in the common types v2 and above.",
      message: "{{description}}",
      severity: "error",
      resolved: false,
      formats: [oas2],
      given:
        "$[paths,'x-ms-paths'].*.*[?(@property === 'x-ms-long-running-operation' && @ === true)]^.responses[?(@property === 'default' || @property.startsWith('5') || @property.startsWith('4'))].schema.$ref",
      then: {
        function: pattern,
        functionOptions: {
          match: ".*/common-types/resource-management/v(([1-9]\\d+)|[2-9])/types.json#/definitions/ErrorResponse",
        },
      },
    },

    ///
    /// ARM RPC rules for Delete patterns
    ///

    // RPC Code: RPC-Delete-V1-02
    DeleteMustNotHaveRequestBody: {
      description: "The delete operation must not have a request body.",
      severity: "error",
      message: "{{description}}",
      resolved: true,
      formats: [oas2],
      given: "$.paths.*.delete.parameters[?(@.in === 'body')]",
      then: {
        function: falsy,
      },
    },
    //https://github.com/Azure/azure-openapi-validator/issues/330
    // RPC Code: RPC-Delete-V1-04
    DeleteResponseBodyEmpty: {
      description: "The delete response body must be empty.",
      message: "{{description}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*[delete].responses['200','204'].schema"],
      then: {
        function: falsy,
      },
    },

    ///
    /// ARM RPC rules for Get patterns
    ///

    // RPC Code: RPC-Get-V1-02
    GetMustNotHaveRequestBody: {
      description: "The Get operation must not have a request body.",
      severity: "error",
      message: "{{description}}",
      resolved: true,
      formats: [oas2],
      given: "$[paths,'x-ms-paths'].*.get.parameters[?(@.in === 'body')]",
      then: {
        function: falsy,
      },
    },
    // github issue https://github.com/Azure/azure-openapi-validator/issues/331
    // Get operation should return 200
    // already have rule to check if operation returns non 2XX, it should mark it as 'x-ms-error-response' explicitly,
    // so here on check if the 200 return '201','202','203'
    // RPC Code: RPC-Get-V1-01
    GetOperation200: {
      description: "The get operation should only return 200.",
      message: "{{description}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*[get].responses['201','202','203','204']"],
      then: {
        function: falsy,
      },
    },

    ///
    /// ARM RPC rules for Patch patterns
    ///

    // RPC Code: RPC-Patch-V1-02
    UnSupportedPatchProperties: {
      description: "Patch may not change the name, location, or type of the resource.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*.patch"],
      then: {
        function: validatePatchBodyParamProperties,
        functionOptions: {
          shouldNot: ["name", "type", "location"],
        },
      },
    },
    //https://github.com/Azure/azure-openapi-validator/issues/324
    // RPC Code: RPC-Patch-V1-03
    ConsistentPatchProperties: {
      description: "The properties in the patch body must be present in the resource model and follow json merge patch.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$.paths.*.patch"],
      then: {
        function: consistentPatchProperties,
      },
    },

    // RPC Code: RPC-Patch-V1-06
    PatchResponseCode: {
      description: "Synchronous PATCH must have 200 return code and LRO PATCH must have 200 and 202 return codes.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*[patch]"],
      then: {
        function: PatchResponseCode,
      },
    },

    //https://github.com/Azure/azure-openapi-validator/issues/335
    // RPC Code: RPC-Patch-V1-06, RPC-Async-V1-08
    LroPatch202: {
      description: "Async PATCH should return 202.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*[patch][?(@property === 'x-ms-long-running-operation' && @ === true)]^"],
      then: {
        function: lroPatch202,
      },
    },
    // RPC Code: RPC-Patch-V1-09
    PatchSkuProperty: {
      description: "RP must implement PATCH for the 'SKU' envelope property if it's defined in the resource model.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*.patch"],
      then: {
        function: validatePatchBodyParamProperties,
        functionOptions: {
          should: ["sku"],
        },
      },
    },
    // RPC Code: RPC-Patch-V1-10
    PatchBodyParametersSchema: {
      description: "A request parameter of the Patch Operation must not have a required/default/'x-ms-mutability: [\"create\"]' value.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$.paths.*.patch.parameters[?(@.in === 'body')]"],
      then: {
        function: pathBodyParameters,
      },
    },
    // RPC Code: RPC-Patch-V1-11
    PatchIdentityProperty: {
      description: "RP must implement PATCH for the 'identity' envelope property If it's defined in the resource model.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*.patch"],
      then: {
        function: validatePatchBodyParamProperties,
        functionOptions: {
          should: ["identity"],
        },
      },
    },

    ///
    /// ARM RPC rules for Put patterns
    ///

    // RPC Code: RPC-Put-V1-01
    PathForPutOperation: {
      description: "The path for 'put' operation must be under a subscription and resource group.",
      message: "{{description}}",
      severity: "error",
      resolved: false,
      formats: [oas2],
      given: "$[paths,'x-ms-paths'].*[put]^~",
      then: {
        function: verifyArmPath,
        functionOptions: {
          segmentToCheck: "resourceGroupScope",
        },
      },
    },
    // RPC Code: RPC-Put-V1-05
    RepeatedPathInfo: {
      description:
        "Information in the Path should not be repeated in the request body (i.e. subscription ID, resource group name, resource name).",
      message: "The '{{error}}' already appears in the path, please don't repeat it in the request body.",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: "$[paths,'x-ms-paths'].*.put^",
      then: {
        function: bodyParamRepeatedInfo,
      },
    },
    // RPC Code: RPC-Put-V1-07
    RequestSchemaForTrackedResourcesMustHaveTags: {
      description: "A tracked resource MUST always have tags as a top level optional property",
      message: "{{description}}. {{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: "$[paths,'x-ms-paths'].*.put^",
      then: {
        function: trackedResourceTagsPropertyInRequest,
      },
    },

    // RPC Code: RPC-Put-V1-11
    PutResponseSchemaDescription: {
      description: `For any PUT, response code should be 201 if resource was newly created and 200 if updated.`,
      message: "{{error}}",
      severity: "error",
      resolved: false,
      given: ["$[paths,'x-ms-paths'].*.put.responses"],
      then: {
        function: PutResponseSchemaDescription,
      },
    },

    // RPC Code: RPC-Put-V1-12
    PutGetPatchResponseSchema: {
      description: `For a given path with PUT, GET and PATCH operations, the schema of the response must be the same.`,
      message:
        "{{property}} has different responses for PUT/GET/PATCH operations. The PUT/GET/PATCH operations must have same schema response.",
      severity: "error",
      resolved: false,
      given: ["$[paths,'x-ms-paths'].*.put^"],
      then: {
        function: putGetPatchScehma,
      },
    },
    // RPC Code: RPC-Put-V1-12
    XmsResourceInPutResponse: {
      description: `The 200 response model for an ARM PUT operation must have x-ms-azure-resource extension set to true in its hierarchy.`,
      message: "{{error}}",
      severity: "error",
      resolved: true,
      given: ["$[paths,'x-ms-paths'].*.put"],
      then: {
        function: withXmsResource,
      },
    },
    // RPC Code: RPC-Put-V1-14
    LocationMustHaveXmsMutability: {
      description: "A tracked resource's location property must have the x-ms-mutability properties set as read, create.",
      message: 'Property `location` must have `"x-ms-mutability":["read", "create"]` extension defined.',
      severity: "warn",
      resolved: false,
      formats: [oas2],
      given: ["$.definitions[*].properties.location"],
      then: {
        function: locationMustHaveXmsMutability,
      },
    },
    // RPC Code: RPC-Put-V1-24
    ResponseSchemaSpecifiedForSuccessStatusCode: {
      description: "The 200 and 201 success status codes for an ARM PUT operation must have a response schema specified.",
      message: "{{error}}",
      severity: "error",
      resolved: false,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*.put"],
      then: {
        function: responseSchemaSpecifiedForSuccessStatusCode,
      },
    },

    // RPC Code: RPC-POST-V1-05
    ParametersInPost: {
      description: "For a POST action parameters MUST be in the payload and not in the URI.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: "$[paths,'x-ms-paths'].*[post][parameters]",
      then: {
        function: ParametersInPost,
      },
    },

    ///
    /// ARM RPC rules for Post patterns
    ///

    // RPC Code: RPC-POST-V1-02
    SyncPostReturn: {
      description: "A synchronous Post operation should return 200 with response schema or 204 without response schema.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: "$[paths,'x-ms-paths'].*[post]",
      then: {
        function: SyncPostReturn,
      },
    },

    // RPC Code: RPC-POST-V1-03
    LroPostReturn: {
      description: "A long running Post operation should return 200 with response schema and 202 without response schema.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: "$[paths,'x-ms-paths'].*[post].[?(@property === 'x-ms-long-running-operation' && @ === true)]^",
      then: {
        function: lroPostReturn,
      },
    },

    ///
    /// ARM RPC rules for Uri path patterns
    ///

    // RPC Code: RPC-Uri-V1-01
    PathContainsSubscriptionId: {
      description: "Path for resource group scoped CRUD methods MUST contain a subscriptionId parameter.",
      message: "{{error}}",
      severity: "error",
      resolved: false,
      formats: [oas2],
      given: "$[paths,'x-ms-paths'].*[get,patch,put,delete]^~",
      then: {
        function: verifyArmPath,
        functionOptions: {
          segmentToCheck: "subscriptionIdParam",
        },
      },
    },
    // RPC Code: RPC-Uri-V1-02
    PathContainsResourceGroup: {
      description: "Path for resource group scoped CRUD methods MUST contain a resourceGroupName parameter.",
      message: "{{error}}",
      severity: "error",
      resolved: false,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*[get,patch,put,delete]^~"],
      then: {
        function: verifyArmPath,
        functionOptions: {
          segmentToCheck: "resourceGroupParam",
        },
      },
    },
    // RPC Code: RPC-Uri-V1-04
    PathContainsResourceType: {
      description: "Path for resource CRUD methods MUST contain a resource type.",
      message: "{{error}}",
      severity: "error",
      resolved: false,
      formats: [oas2],
      given: "$[paths,'x-ms-paths'].*[get,patch,put,delete]^~",
      then: {
        function: verifyArmPath,
        functionOptions: {
          segmentToCheck: "resourceType",
        },
      },
    },
    // RPC Code: RPC-Uri-V1-05
    ResourceNameRestriction: {
      description: "This rule ensures that the authors explicitly define these restrictions as a regex on the resource name.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: "$[paths,'x-ms-paths'].*.^",
      then: {
        function: resourceNameRestriction,
      },
    },
    // RPC Code: RPC-Uri-V1-06, RPC-Put-V1-02
    PathForNestedResource: {
      description: "Path for CRUD methods on a nested resource type MUST follow valid resource naming.",
      message: "{{error}}",
      severity: "error",
      resolved: false,
      formats: [oas2],
      given: "$[paths,'x-ms-paths'].*[get,patch,delete,put]^~",
      then: {
        function: verifyArmPath,
        functionOptions: {
          segmentToCheck: "nestedResourceType",
        },
      },
    },
    // RPC Code: RPC-Uri-V1-07, RPC-POST-V1-01
    PathForResourceAction: {
      description: "Path for 'post' method on a resource type MUST follow valid resource naming.",
      message: "{{description}}",
      severity: "error",
      resolved: false,
      formats: [oas2],
      given: "$[paths,'x-ms-paths'].*.post^~",
      then: {
        function: pattern,
        functionOptions: {
          match: ".*/providers/[\\w\\.]+(?:/\\w+/(default|{\\w+}))*/\\w+$",
        },
      },
    },
    // RPC Code: RPC-Uri-V1-08
    ApiVersionParameterRequired: {
      description: "All operations should have api-version query parameter.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$.paths.*", "$.x-ms-paths.*"],
      then: {
        function: hasApiVersionParameter,
        functionOptions: {
          methods: ["get", "put", "patch", "post", "delete", "options", "head", "trace"],
        },
      },
    },
    // RPC Code: RPC-Uri-V1-10
    NoDuplicatePathsForScopeParameter: {
      description: 'Paths with explicitly defined scope should not be present if there is an equivalent path with the "scope" parameter.',
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$.paths[?(@property.match(/.*{scope}.*/))]~))", "$.x-ms-paths[?(@property.match(/.*{scope}.*/))]~))"],
      then: {
        function: noDuplicatePathsForScopeParameter,
      },
    },

    ///
    /// ARM rules for operations API
    ///

    // RPC Code: RPC-Operations-V1-01
    OperationsApiSchemaUsesCommonTypes: {
      description: "Operations API path must follow the schema provided in the common types.",
      message: "{{description}}",
      severity: "error",
      resolved: false,
      formats: [oas2],
      given: "$[paths,'x-ms-paths'][?(@property.match(/\\/providers\\/\\w+\\.\\w+\\/operations$/i))].get.responses.200.schema.$ref",
      then: {
        function: pattern,
        functionOptions: {
          match: ".*/common-types/resource-management/v\\d+/types.json#/definitions/OperationListResult",
        },
      },
    },

    ///
    /// ARM rules without an RPC code
    ///

    ArrayMustHaveType: {
      description: "Array type must have a type except for any type.",
      message: "{{error}}",
      severity: "error",
      resolved: false,
      formats: [oas2],
      given: ["$.definitions..items[?(@object())]^"],
      then: {
        function: truthy,
        field: "type",
      },
    },
    NoErrorCodeResponses: {
      description: "Responses must not have error codes. All errors must be surfaced using `default`.",
      message: "{{description}}",
      severity: "error",
      resolved: false,
      formats: [oas2],
      given: ["$.paths.*.*.responses.*~"],
      then: {
        function: noErrorCodeResponses,
      },
    },
    LroWithOriginalUriAsFinalState: {
      description: "The long running operation with final-state-via:original-uri should have a sibling 'get' operation.",
      message: "{{description}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: [
        "$[paths,'x-ms-paths'].*[put,patch,delete].x-ms-long-running-operation-options[?(@property === 'final-state-via' && @ === 'original-uri')]^",
      ],
      then: {
        function: validateOriginalUri,
      },
    },
    LroPostMustNotUseOriginalUriAsFinalState: {
      description: "The long running post operation must not use final-stat-via:original-uri.",
      message: "{{description}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: [
        "$[paths,'x-ms-paths'].*.post.x-ms-long-running-operation-options[?(@property === 'final-state-via' && @ === 'original-uri')]^",
      ],
      then: {
        function: falsy,
      },
    },
    APIVersionPattern: {
      description:
        "The API Version parameter MUST be in the Year-Month-Date format (i.e. 2016-07-04.)  NOTE that this is the en-US ordering of month and date.",
      severity: "error",
      message: "{{description}}",
      resolved: true,
      formats: [oas2],
      given: "$.info.version",
      then: {
        function: pattern,
        functionOptions: {
          match: "^(20\\d{2})-(0[1-9]|1[0-2])-((0[1-9])|[12][0-9]|3[01])(-(preview))?$",
        },
      },
    },
    ParameterNotDefinedInGlobalParameters: {
      description:
        "Per ARM guidelines, if `subscriptionId` is used anywhere as a path parameter, it must always be defined as global parameter. `api-version` is almost always an input parameter in any ARM spec and must also be defined as a global parameter.",
      message: "{{error}}",
      severity: "warn",
      resolved: false,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'parameters')]"],
      then: {
        function: parameterNotDefinedInGlobalParameters,
      },
    },
    ParameterNotUsingCommonTypes: {
      description: "This rule checks for parameters defined in common-types that are not using the common-types definition.",
      message: "{{error}}",
      severity: "warn",
      resolved: false,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'parameters')]"],
      then: {
        function: parameterNotUsingCommonTypes,
      },
    },
    CollectionObjectPropertiesNaming: {
      description:
        "Per ARM guidelines, a model returned by an `x-ms-pageable` operation must have a property named `value`. This property indicates what type of array the object is.",
      severity: "error",
      message: "{{error}}",
      resolved: true,

      formats: [oas2],
      given: "$.paths.*[get,post]",
      then: {
        function: collectionObjectPropertiesNaming,
      },
    },
    // this rule covers BodyPropertiesNamesCamelCase and DefinitionsPropertiesNamesCamelCase
    DefinitionsPropertiesNamesCamelCase: {
      description: "Property names should be camel case.",
      message: "Property name should be camel case.",
      severity: "error",
      resolved: false,
      given: "$.definitions..[?(@property === 'type' && @ === 'object')]^.properties[?(@property.match(/^[^@].+$/))]~",
      then: {
        function: camelCase,
      },
    },
    GuidUsage: {
      description: `Verifies whether format is specified as "uuid" or not.`,
      message:
        "Usage of Guid is not recommended. If GUIDs are absolutely required in your service, please get sign off from the Azure API review board.",
      severity: "error",
      resolved: false,
      given: "$..[?(@property === 'format' && @ === 'uuid')]",
      then: {
        function: falsy,
      },
    },
    InvalidSkuModel: {
      description: `A Sku model must have 'name' property. It can also have 'tier', 'size', 'family', 'capacity' as optional properties.`,
      message: "{{error}}",
      severity: "warn",
      resolved: true,
      given: "$.definitions[?(@property.match(/^sku$/i))]",
      then: {
        function: skuValidation,
      },
    },
    NonApplicationJsonType: {
      description: `Verifies whether operation supports "application/json" as consumes or produces section.`,
      message: "Only content-type 'application/json' is supported by ARM",
      severity: "warn",
      resolved: true,
      given: ["$[produces,consumes].*", "$[paths,'x-ms-paths'].*.*[produces,consumes].*"],
      then: {
        function: pattern,
        functionOptions: {
          match: "application/json",
        },
      },
    },
    SecurityDefinitionsStructure: {
      description: `Each OpenAPI json document must contain a security definitions section and the section must adhere to a certain format.`,
      message: "{{error}}",
      severity: "error",
      resolved: true,
      given: ["$"],
      then: {
        function: securityDefinitionsStructure,
      },
    },
    SubscriptionIdParameterInOperations: {
      description: `'subscriptionId' must not be an operation parameter and must be declared in the global parameters section.`,
      message:
        "Parameter 'subscriptionId' is not allowed in the operations section, define it in the global parameters section instead/Parameter '{{path}}' is referenced but not defined in the global parameters section of Service Definition",
      severity: "error",
      resolved: false,
      given: [
        "$[paths,'x-ms-paths'].*.*.parameters.*[?(@property === 'name' && @.match(/^subscriptionid$/i))]^",
        "$[paths,'x-ms-paths'].*.parameters.*[?(@property === 'name' && @.match(/^subscriptionid$/i))]^",
      ],
      then: {
        function: falsy,
      },
    },
    OperationsApiResponseSchema: {
      severity: "error",
      message: "The response schema of operations API '{{error}}' does not match the ARM specification. Please standardize the schema.",
      resolved: true,
      given: "$.paths[?(@property.match(/\\/providers\\/\\w+\\.\\w+\\/operations$/i))].get.responses.200.schema",
      then: {
        function: operationsApiSchema,
      },
    },
    HttpsSupportedScheme: {
      description: "Verifies whether specification supports HTTPS scheme or not.",
      message: "Azure Resource Management only supports HTTPS scheme.",
      severity: "warn",
      resolved: false,
      formats: [oas2],
      given: ["$.schemes"],
      then: {
        function: httpsSupportedScheme,
      },
    },
    MissingDefaultResponse: {
      description: "All operations should have a default (error) response.",
      message: "Operation is missing a default response.",
      severity: "error",
      given: "$.paths.*.*.responses",
      then: {
        field: "default",
        function: truthy,
      },
    },
  },
}
export default ruleset
