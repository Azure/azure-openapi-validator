import { oas2 } from "@stoplight/spectral-formats"
import { falsy, pattern, truthy } from "@stoplight/spectral-functions"
import common from "./az-common"
import verifyArmPath from "./functions/arm-path-validation"
import bodyParamRepeatedInfo from "./functions/body-param-repeated-info"
import { camelCase } from "./functions/camel-case"
import collectionObjectPropertiesNaming from "./functions/collection-object-properties-naming"
import { consistentPatchProperties } from "./functions/consistent-patch-properties"
import { DeleteResponseCodes } from "./functions/delete-response-codes"
import { getCollectionOnlyHasValueAndNextLink } from "./functions/get-collection-only-has-value-nextlink"
import hasApiVersionParameter from "./functions/has-api-version-parameter"
import hasheader from "./functions/has-header"
import httpsSupportedScheme from "./functions/https-supported-scheme"
import { latestVersionOfCommonTypesMustBeUsed } from "./functions/latest-version-of-common-types-must-be-used"
import locationMustHaveXmsMutability from "./functions/location-must-have-xms-mutability"
import validateOriginalUri from "./functions/lro-original-uri"
import { lroPatch202 } from "./functions/lro-patch-202"
import provisioningStateSpecifiedForLROPatch from "./functions/lro-patch-provisioning-state-specified"
import { lroPostReturn } from "./functions/lro-post-return"
import provisioningStateSpecifiedForLROPut from "./functions/lro-put-provisioning-state-specified"
import { validateSegmentsInNestedResourceListOperation } from "./functions/missing-segments-in-nested-resource-list-operation"
import noDuplicatePathsForScopeParameter from "./functions/no-duplicate-paths-for-scope-parameter"
import { noErrorCodeResponses } from "./functions/no-error-code-responses"
import operationsApiSchema from "./functions/operations-api-schema"
import { operationsApiTenantLevelOnly } from "./functions/operations-api-tenant-level-only"
import { parameterNotDefinedInGlobalParameters } from "./functions/parameter-not-defined-in-global-parameters"
import { parameterNotUsingCommonTypes } from "./functions/parameter-not-using-common-types"
import { ParametersInPointGet } from "./functions/parameters-in-point-get"
import { ParametersInPost } from "./functions/parameters-in-post"
import pathBodyParameters from "./functions/patch-body-parameters"
import { patchPropertiesCorrespondToPutProperties } from "./functions/patch-properties-correspond-to-put-properties"
import { PatchResponseCodes } from "./functions/patch-response-codes"
import pathForTrackedResourceTypes from "./functions/path-for-tracked-resource-types"
import pathSegmentCasing from "./functions/path-segment-casing"
import { PostResponseCodes } from "./functions/post-response-codes"
import { propertiesTypeObjectNoDefinition } from "./functions/properties-type-object-no-definition"
import provisioningState from "./functions/provisioning-state"
import { provisioningStateMustBeReadOnly } from "./functions/provisioning-state-must-be-read-only"
import putGetPatchSchema from "./functions/put-get-patch-schema"
import { putRequestResponseScheme } from "./functions/put-request-response-scheme"
import { PutResponseCodes } from "./functions/put-response-codes"
import { requestBodyMustExistForPutPatch } from "./functions/request-body-must-exist-for-put-patch"
import { reservedResourceNamesModelAsEnum } from "./functions/reserved-resource-names-model-as-enum"
import resourceNameRestriction from "./functions/resource-name-restriction"
import responseSchemaSpecifiedForSuccessStatusCode from "./functions/response-schema-specified-for-success-status-code"
import { securityDefinitionsStructure } from "./functions/security-definitions-structure"
import skuValidation from "./functions/sku-validation"
import { SyncPostReturn } from "./functions/synchronous-post-return"
import { systemDataInPropertiesBag } from "./functions/system-data-in-properties-bag"
import trackedResourceTagsPropertyInRequest from "./functions/trackedresource-tags-property-in-request"
import { validatePatchBodyParamProperties } from "./functions/validate-patch-body-param-properties"
import withXmsResource from "./functions/with-xms-resource"
import verifyXMSLongRunningOperationProperty from "./functions/xms-long-running-operation-property"
import {trackedExtensionResourcesAreNotAllowed} from "./functions/tracked-extension-resources-are-not-allowed"
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
    PutResponseCodes: {
      description: "LRO and Synchronous PUT must have 200 & 201 return codes.",
      severity: "error",
      message: "{{error}}",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*[put]"],
      then: {
        function: PutResponseCodes,
      },
    },

    // RPC Code: RPC-Async-V1-02
    //PUT
    ProvisioningStateSpecifiedForLROPut: {
      description:
        'A LRO PUT operation\'s response schema must have "ProvisioningState" property specified for the 200 and 201 status codes.',
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*[put][?(@property === 'x-ms-long-running-operation' && @ === true)]^"],
      then: {
        function: provisioningStateSpecifiedForLROPut,
      },
    },
    //Patch
    ProvisioningStateSpecifiedForLROPatch: {
      description:
        'A long running Patch operation\'s response schema must have "ProvisioningState" property specified for the 200 status code.',
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: [
        "$[paths,'x-ms-paths'].*[patch][?(@property === 'x-ms-long-running-operation' && @ === true)]^.responses[?(@property == '200')]",
      ],
      then: {
        function: provisioningStateSpecifiedForLROPatch,
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

    // RPC Code: RPC-Async-V1-11
    PostResponseCodes: {
      description:
        "Synchronous POST must have either 200 or 204 return codes and LRO POST must have 202 return code. LRO POST should also have a 200 return code only if the final response is intended to have a schema",
      severity: "error",
      message: "{{error}}",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*[post]"],
      then: {
        function: PostResponseCodes,
      },
    },

    // RPC Code: RPC-Async-V1-15
    XMSLongRunningOperationProperty: {
      description:
        "If an operation's (PUT/POST/PATCH/DELETE) responses have `Location` or `Azure-AsyncOperation` headers then it MUST have the property `x-ms-long-running-operation` set to `true`",
      message:
        "If an operation's (PUT/POST/PATCH/DELETE) responses have `Location` or `Azure-AsyncOperation` headers then it MUST have the property `x-ms-long-running-operation` set to `true`",
      severity: "error",
      formats: [oas2],
      resolved: true,
      given: "$[paths,'x-ms-paths'].*[put,patch,post,delete]",
      then: {
        function: verifyXMSLongRunningOperationProperty,
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

    // RPC Code: RPC-Delete-V1-01
    DeleteResponseCodes: {
      description: "Synchronous DELETE must have 200 & 204 return codes and LRO DELETE must have 202 & 204 return codes.",
      severity: "error",
      message: "{{error}}",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*[delete]"],
      then: {
        function: DeleteResponseCodes,
      },
    },

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
    /// ARM RPC rules for Policy Guidelines
    ///

    // RPC Code: RPC-Policy-V1-05
    AvoidAdditionalProperties: {
      description: "The use of additionalProperties is not allowed except for user defined tags on tracked resources.",
      severity: "error",
      stagingOnly: true,
      message: "{{description}}",
      resolved: true,
      formats: [oas2],
      given: "$.definitions..[?(@property !== 'tags' && @.additionalProperties)]",
      then: {
        function: falsy,
      },
    },

    // RPC Code: RPC-Policy-V1-03
    PropertiesTypeObjectNoDefinition: {
      description:
        "Properties with type:object that don't reference a model definition are not allowed. ARM doesn't allow generic type definitions as this leads to bad customer experience.",
      severity: "error",
      message: "{{error}}",
      resolved: true,
      formats: [oas2],
      given: "$.definitions..[?(@property === 'type' && @ ==='object' || @ ==='' || @property === 'undefined')]^",
      then: {
        function: propertiesTypeObjectNoDefinition,
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

    // RPC Codes: RPC-Get-V1-09, RPC-Arg-V1-01, RPC-Get-V1-06
    GetCollectionOnlyHasValueAndNextLink: {
      description: "Get endpoints for collections of resources must only have the `value` and `nextLink` properties in their model.",
      message: "{{description}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given:
        "$[paths,'x-ms-paths'][?(!@property.endsWith('}') && !@property.endsWith('operations') && !@property.endsWith('default'))][get].responses.200.schema.properties",
      then: {
        function: getCollectionOnlyHasValueAndNextLink,
      },
    },

    // RPC Code: RPC-Get-V1-08
    ParametersInPointGet: {
      description: "Point Get's MUST not have query parameters other than api version.",
      severity: "error",
      message: "{{error}}",
      resolved: true,
      formats: [oas2],
      given: "$[paths,'x-ms-paths']",
      then: {
        function: ParametersInPointGet,
      },
    },

    // RPC Code: RPC-Get-V1-11
    ValidateSegmentsInNestedResourceListOperation: {
      description: "A nested resource type's List operation must include all the parent segments in its api path.",
      severity: "error",
      stagingOnly: true,
      message: "{{error}}",
      resolved: true,
      formats: [oas2],
      given: "$[paths,'x-ms-paths'].*[get]^~",
      then: {
        function: validateSegmentsInNestedResourceListOperation,
      },
    },

    ///
    /// ARM RPC rules for Patch patterns
    ///

    // RPC Code: RPC-Patch-V1-01
    PatchPropertiesCorrespondToPutProperties: {
      description:
        "PATCH request body must only contain properties present in the corresponding PUT request body, and must contain at least one property.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*"],
      then: {
        function: patchPropertiesCorrespondToPutProperties,
      },
    },

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
          shouldNot: ["id", "name", "type", "location"],
        },
      },
    },
    //https://github.com/Azure/azure-openapi-validator/issues/324
    // RPC Code: RPC-Patch-V1-01
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
    PatchResponseCodes: {
      description: "Synchronous PATCH must have 200 return code and LRO PATCH must have 200 and 202 return codes.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*[patch]"],
      then: {
        function: PatchResponseCodes,
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
      description:
        "RP should consider implementing Patch for the 'SKU' envelope property if it's defined in the resource model and the service supports its updation.",
      message: "{{error}}",
      severity: "warn",
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

    // RPC Code: RPC-Put-V1-01, RPC-Get-V1-11
    PathForTrackedResourceTypes: {
      description: "The path must be under a subscription and resource group for tracked resource types.",
      message: "{{description}}",
      severity: "error",
      stagingOnly: true,
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*[get,put]^"],
      then: {
        function: pathForTrackedResourceTypes,
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

    // RPC Code: RPC-Put-V1-12
    PutGetPatchResponseSchema: {
      description: `For a given path with PUT, GET and PATCH operations, the schema of the response must be the same.`,
      message:
        "{{property}} has different responses for PUT/GET/PATCH operations. The PUT/GET/PATCH operations must have same schema response.",
      severity: "error",
      resolved: false,
      given: ["$[paths,'x-ms-paths'].*.put^"],
      then: {
        function: putGetPatchSchema,
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
    // RPC Code: RPC-Put-V1-25
    PutRequestResponseSchemeArm: {
      description: "The request & response('200') schema of the PUT operation must be same.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*[put][responses][?(@property === '200' || @property === '201')]^^"],
      then: {
        function: putRequestResponseScheme,
      },
    },

    // RPC Code: RPC-Put-V1-28, RPC-Patch-V1-12
    RequestBodyMustExistForPutPatch: {
      description: "Every Put and Patch operation must have a request body",
      message: "{{error}}",
      severity: "error",
      stagingOnly: true,
      resolved: true,
      formats: [oas2],
      given: "$[paths,'x-ms-paths'].*[put,patch].parameters",
      then: {
        function: requestBodyMustExistForPutPatch,
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
    // RPC Code: RPC-Uri-V1-07, RPC-POST-V1-01, RPC-POST-V1-07
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
    // RPC Code: RPC-Uri-V1-12
    trackedExtensionResourcesAreNotAllowed: {
      description: "Extension resources cannot be of type tracked",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: "$[paths,'x-ms-paths'].*",
      then: {
        function: trackedExtensionResourcesAreNotAllowed,
      },
    },

    ///
    /// ARM RPC rules for SystemData
    ///

    // RPC Code: RPC-SystemData-V1-01 and RPC-SystemData-V1-02
    // This rule is only applicable for specs that are not using the common-types resource definition.
    // However, we need this rule because not all RP teams can switch to the common-types resource definition.
    SystemDataDefinitionsCommonTypes: {
      description: "System data references must utilize common types.",
      message: "{{description}}",
      severity: "error",
      resolved: false,
      formats: [oas2],
      given: "$.definitions.*.properties.[systemData,SystemData].$ref",
      then: {
        function: pattern,
        functionOptions: {
          match: ".*/common-types/resource-management/v\\d+/types.json#/definitions/systemData",
        },
      },
    },

    // RPC Code: RPC-SystemData-V1-01 and RPC-SystemData-V1-02
    // Ensure systemData is not in the properties bag
    SystemDataInPropertiesBag: {
      description: "System data must be defined as a top-level property, not in the properties bag.",
      message: "{{description}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      // given definitions that have the properties bag
      given: ["$.definitions.*.properties[?(@property === 'properties')]^"],
      then: {
        function: systemDataInPropertiesBag,
      },
    },

    ///
    /// ARM RPC rules for constrained resource collections
    ///

    // RPC Code: RPC-ConstrainedCollections-V1-04
    ReservedResourceNamesModelAsEnum: {
      description:
        "Service-defined (reserved) resource names should be represented as an enum type with modelAsString set to true, not as a static string in the path.",
      message: "{{error}}",
      severity: "warn",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths']"],
      then: {
        function: reservedResourceNamesModelAsEnum,
      },
    },

    ///
    /// ARM RPC rules for operations API
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

    // RPC Code: RPC-Operations-V1-02
    OperationsApiTenantLevelOnly: {
      description: "The get operations endpoint must only be at the tenant level.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: "$.[paths,'x-ms-paths']",
      then: {
        function: operationsApiTenantLevelOnly,
      },
    },

    ///
    /// ARM rules without an RPC code
    ///

    LatestVersionOfCommonTypesMustBeUsed: {
      description: "This rule checks for references that aren't using latest version of common-types.",
      message: "{{error}}",
      severity: "warn",
      resolved: false,
      formats: [oas2],
      given: "$..['$ref']",
      then: {
        function: latestVersionOfCommonTypesMustBeUsed,
      },
    },
    ProvisioningStateMustBeReadOnly: {
      description: "This is a rule introduced to validate if provisioningState property is set to readOnly or not.",
      message: "{{error}}",
      severity: "warn",
      stagingOnly: true,
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*.*.responses.*.schema"],
      then: {
        function: provisioningStateMustBeReadOnly,
      },
    },
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
      description: "Invalid status code specified. Please refer to the documentation for the allowed set.",
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
