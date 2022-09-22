import { oas2 } from "@stoplight/spectral-formats"
import { casing, falsy, pattern, truthy } from "@stoplight/spectral-functions"
import common from "./az-common"
import verifyArmPath from "./functions/arm-path-validation"
import bodyParamRepeatedInfo from "./functions/body-param-repeated-info"
import collectionObjectPropertiesNaming from "./functions/collection-object-properties-naming"
import { consistentPatchProperties } from "./functions/consistent-patch-properties"
import { longRunningResponseStatusCodeArm } from "./functions/Extensions/long-running-response-status-code";
import hasApiVersionParameter from "./functions/has-api-version-parameter"
import hasheader from "./functions/has-header"
import httpsSupportedScheme from "./functions/https-supported-scheme";
import locationMustHaveXmsMutability from "./functions/location-must-have-xms-mutability";
import validateOriginalUri from "./functions/lro-original-uri"
import { lroPatch202 } from "./functions/lro-patch-202"
import operationsApiSchema from "./functions/operations-api-schema"
import pathBodyParameters from "./functions/patch-body-parameters"
import pathSegmentCasing from "./functions/path-segment-casing"
import provisioningState from "./functions/provisioning-state"
import putGetPatchScehma from "./functions/put-get-patch-schema"
import { securityDefinitionsStructure } from "./functions/security-definitions-structure";
import skuValidation from "./functions/sku-validation"
import { validatePatchBodyParamProperties } from "./functions/validate-patch-body-param-properties"
import withXmsResource from "./functions/with-xms-resource"
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
    //https://github.com/Azure/azure-openapi-validator/issues/324
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
    //https://github.com/Azure/azure-openapi-validator/issues/335
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
    //https://github.com/Azure/azure-openapi-validator/issues/330
    DeleteResponseBodyEmpty: {
      description: "The delete response body must be empty.",
      message: "{{description}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*[delete].responses.['200','204'].schema"],
      then: {
        function: falsy,
      },
    },
    // github issue https://github.com/Azure/azure-openapi-validator/issues/331
    //Get operation should return 200
    // already have rule to check if operation returns non 2XX, it should mark it as 'x-ms-error-response' explicitly,
    // so here on check if the 200 return '201','202','203'
    GetOperation200: {
      description: "The get operation should only return 200.",
      message: "{{description}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*[get].responses.['201','202','203','204']"],
      then: {
        function: falsy,
      },
    },
    // https://github.com/Azure/azure-openapi-validator/issues/332
    ProvisioningStateValidation: {
      description: "ProvisioningState must have terminal states: Succeeded, Failed and Canceled.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$.definitions..provisioningState[?(@property === 'enum')]^"],
      then: {
        function: provisioningState,
      },
    },
    // x-ms-long-running-operation-options should indicate the type of response header to track the async operation
    //https://github.com/Azure/azure-openapi-validator/issues/324
    XmsLongRunningOperationOptions: {
      description:
        "The x-ms-long-running-operation-options should be specified explicitly to indicate the type of response header to track the async operation.",
      message: "{{description}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'x-ms-long-running-operation' && @ === true)]^"],
      then: {
        field: "x-ms-long-running-operation-options",
        function: truthy,
      },
    },
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
          match: "^(20\\d{2})-(0[1-9]|1[0-2])-((0[1-9])|[12][0-9]|3[01])(-(preview|alpha|beta|rc|privatepreview))?$",
        },
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
    // this rule covers BodyPropertiesNamesCamelCase and DefinitionsPropertiesNamesCamelCase
    DefinitionsPropertiesNamesCamelCase: {
      description: "Property names should be camel case.",
      message: "Property name should be camel case.",
      severity: "error",
      resolved: false,
      given: "$..[?(@.type === 'object')].properties.[?(!@property.match(/^@.+$/))]~",
      then: {
        function: casing,
        functionOptions: {
          type: "camel",
        },
      },
    },
    GuidUsage: {
      description: `Verifies whether format is specified as "uuid" or not.`,
      message:
        "Usage of Guid is not recommended. If GUIDs are absolutely required in your service, please get sign off from the Azure API review board.",
      severity: "error",
      resolved: false,
      given: "$..[?(@property === 'format'&& @ === 'guid')]",
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
    LongRunningResponseStatusCode: {
      description: "A LRO Post operation with return schema must have \"x-ms-long-running-operation-options\" extension enabled.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'x-ms-long-running-operation' && @ === true)]^^"],
      then: {
        function: longRunningResponseStatusCodeArm,
      },
    },
    LocationMustHaveXmsMutability: {
      description: 'A tracked resource\'s location property must have the x-ms-mutability properties set as read, create.',
      message: 'Property `location` must have `"x-ms-mutability":["read", "create"]` extension defined.',
      severity: "warn",
      resolved: false,
      formats: [oas2],
      given: ['$.definitions[*].properties.location'],
      then: {
        function: locationMustHaveXmsMutability
      }
    },
    HttpsSupportedScheme: {
      description: 'Verifies whether specification supports HTTPS scheme or not.',
      message: 'Azure Resource Management only supports HTTPS scheme.',
      severity: "warn",
      resolved: false,
      formats: [oas2],
      given: ["$.schemes"],
      then: {
        function: httpsSupportedScheme
      }
    }
  },
}

export default ruleset
