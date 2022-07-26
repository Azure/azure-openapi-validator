import { OpenApiTypes, IRuleSet } from "@microsoft.azure/openapi-validator-core"
import {
  allResourcesHaveDelete,
  ArmResourcePropertiesBag,
  trackedResourceBeyondsThirdLevel,
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
        execute: ArmResourcePropertiesBag,
      },
    }
  },
}
export default armRuleset
