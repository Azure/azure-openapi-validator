import { OpenApiTypes, IRuleSet } from "@microsoft.azure/openapi-validator-core"
import { patchModelProperties, trackedResourceBeyondThirdLevel, trackedResourceMustHavePut } from "../functions/arm-resource-validation"
export const armRuleset: IRuleSet = {
  documentationUrl: "https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md",
  rules: {
    TrackedResourceMustHavePut: {
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
      given: "$",
      then: {
        execute: trackedResourceMustHavePut,
      },
    },
    TrackedResourceBeyondThirdLevel: {
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
      given: "$",
      then: {
        execute: trackedResourceBeyondThirdLevel,
      },
    },
    PatchRequestBodyProperties: {
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
      given: "$",
      then: {
        execute: patchModelProperties,
      },
    },
    // https://github.com/Azure/azure-openapi-validator/issues/329
    AllResourcesMustHaveDelete: {
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
      given: "$",
      then: {
        execute: patchModelProperties,
      },
    },
  },
}
export default armRuleset
