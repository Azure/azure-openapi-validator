import { OpenApiTypes, IRuleSet } from "@microsoft.azure/openapi-validator-core"
import {
  allResourcesHaveDelete,
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
  },
}
export default armRuleset
