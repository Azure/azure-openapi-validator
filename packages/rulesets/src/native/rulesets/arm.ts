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
} from "../functions/arm-resource-validation"
export const armRuleset: IRuleSet = {
  documentationUrl: "https://github.com/Azure/azure-openapi-validator/blob/develop/docs/rules.md",
  rules: {
    TrackedResourcesMustHavePut: {
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
      given: "$",
      then: {
        execute: trackedResourcesMustHavePut,
      },
    },
    TrackedResourceBeyondsThirdLevel: {
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
      given: "$",
      then: {
        execute: trackedResourceBeyondsThirdLevel,
      },
    },
    // https://github.com/Azure/azure-openapi-validator/issues/329
    AllResourcesMustHaveDelete: {
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
      given: "$",
      then: {
        execute: allResourcesHaveDelete,
      },
    },
    ArmResourcePropertiesBag:{
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
    BodyTopLevelProperties:{
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
    OperationsAPIImplementation:{
      description:
        "Per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md), each RP must expose an operations API that returns information about all the operations available with the service.",
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
      given: "$",
      then: {
        execute: operationsAPIImplementation,
      },
    },
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
  },
}
export default armRuleset
