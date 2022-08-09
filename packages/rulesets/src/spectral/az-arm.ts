import { oas2 } from "@stoplight/spectral-formats"
import { falsy, pattern, truthy } from "@stoplight/spectral-functions"
import common from "./az-common"
import verifyArmPath from "./functions/arm-path-validation"
import bodyParamRepeatedInfo from "./functions/body-param-repeated-info"
import { consistentPatchProperties } from "./functions/consistent-patch-properties"
import hasApiVersionParameter from "./functions/has-api-version-parameter"
import hasheader from "./functions/has-header"
import validateOriginalUri from "./functions/lro-original-uri"
import { lroPatch202 } from "./functions/lro-patch-202"
import pathBodyParameters from "./functions/patch-body-parameters"
import pathSegmentCasing from "./functions/path-segment-casing"
import provisioningState from "./functions/provisioning-state"
import { validatePatchBodyParamProperties } from "./functions/validate-patch-body-param-properties"
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
      severity: "warn",
      formats: [oas2],
      given: "$.paths[*][*].responses[?(@property == '202')]^",
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
      severity: "warn",
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
      severity: "warn",
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
      severity: "warn",
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
      severity: "warn",
      resolved: true,
      formats: [oas2],
      given: "$[paths,'x-ms-paths'].*.put^",
      then: {
        function: bodyParamRepeatedInfo,
      },
    },
  },
}

export default ruleset
