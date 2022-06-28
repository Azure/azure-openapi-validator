import { OpenApiTypes, IRuleSet } from "@microsoft.azure/openapi-validator-core"
import { trackedResourceMustHavePut } from "../functions/arm-resource-validation"
export const armRuleset: IRuleSet = {
  documentationUrl: "https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md",
  rules: {
    AllTrackedResourceMustHavePut: {
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
      given: "$",
      then: {
        execute: trackedResourceMustHavePut,
      },
    },
  },
}

export default armRuleset
