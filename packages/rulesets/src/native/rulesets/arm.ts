import { OpenApiTypes, IRuleSet } from "@microsoft.azure/openapi-validator-core"
import {
  allResourcesHaveDelete,
  armResourcePropertiesBag,
  bodyTopLevelProperties,
  operationsAPIImplementation,
  resourcesHaveRequiredProperties,
  trackedResourceBeyondsThirdLevel,
  trackedResourcesHavePatch,
  trackedResourcesMustHavePut,
  xmsPageableListByRGAndSubscriptions,
} from "../functions/arm-resource-validation"
import { providerNamespace } from "../functions/provider-namespace"
export const armRuleset: IRuleSet = {
  documentationUrl: "https://github.com/Azure/azure-openapi-validator/blob/develop/docs/rules.md",
  rules: {
    ///
    /// ARM RPC rules for Delete patterns
    ///

    // https://github.com/Azure/azure-openapi-validator/issues/329
    // RPC Code: RPC-Delete-V1-03
    AllResourcesMustHaveDelete: {
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
      given: "$",
      then: {
        execute: allResourcesHaveDelete,
      },
    },

    ///
    /// ARM RPC rules for Get patterns
    ///

    // RPC Code: RPC-Get-V1-03, RPC-Put-V1-08
    RequiredPropertiesMissingInResourceModel: {
      description: `Per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md), a 'Resource' model must have the 'name', 'id' and 'type' properties defined as 'readOnly' in its hierarchy.`,
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
      given: "$",
      then: {
        execute: resourcesHaveRequiredProperties,
      },
    },
    // RPC Code: RPC-Get-V1-07
    ArmResourcePropertiesBag: {
      description:
        "Per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md), top level properties should not be repeated inside the properties bag for ARM resources.",
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
      given: "$",
      then: {
        execute: armResourcePropertiesBag,
      },
    },

    ///
    /// ARM RPC rules for Put patterns
    ///

    // RPC Code: RPC-Put-V1-06
    BodyTopLevelProperties: {
      description:
        "Per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md), top level properties of a resource should be only ones from the allowed set.",
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
      given: "$",
      then: {
        execute: bodyTopLevelProperties,
      },
    },
    // RPC Code: RPC-Put-V1-19
    TrackedResourceBeyondsThirdLevel: {
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
      given: "$",
      then: {
        execute: trackedResourceBeyondsThirdLevel,
      },
    },
    // RPC Code: RPC-Put-V1-22
    TrackedResourcesMustHavePut: {
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
      given: "$",
      then: {
        execute: trackedResourcesMustHavePut,
      },
    },

    ///
    /// ARM RPC rules for Uri path patterns
    ///

    // RPC Code: RPC-Uri-V1-03
    PathResourceProviderMatchNamespace: {
      description: `Verifies whether the last resource provider matches namespace or not. E.g the path /providers/Microsoft.Compute/virtualMachines/{vmName}/providers/Microsoft.Insights/extResource/{extType}' is allowed only if Microsoft.Insights matches the namespace (Microsoft.Insights).`,
      severity: "error",
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      given: ["$[paths,'x-ms-paths'].*~"],
      then: {
        execute: providerNamespace,
      },
    },

    ///
    /// ARM RPC rules for operations API
    ///

    // RPC-Operations-V1-01: RPs MUST expose a GET for the RP's set of available operations
    OperationsAPIImplementation: {
      description:
        "Per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md), each RP must expose an operations API that returns information about all the operations available with the service.",
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      scope: "Global",
      severity: "error",
      given: "$",
      then: {
        execute: operationsAPIImplementation,
      },
    },

    ///
    /// ARM rules wthout an RPC code
    ///
    // https://github.com/Azure/azure-openapi-validator/issues/329
    TrackedResourcePatchOperation: {
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
      given: "$",
      then: {
        execute: trackedResourcesHavePatch,
      },
    },
    XmsPageableListByRGAndSubscriptions: {
      description: `When a tracked resource has list by resource group and subscription operations, the x-ms-pageable extension values must be same for both operations. A tracked resource is a resource with a 'location' property as required. If this rule flags a resource which does not have a 'location' property, then it might be a false positive.`,
      severity: "warning",
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      then: {
        execute: xmsPageableListByRGAndSubscriptions,
      },
    },
  },
}
export default armRuleset
