import { pattern } from "@microsoft.azure/openapi-validator-functions"
import { OpenApiTypes } from "../types"
import { IRuleSet } from "../types"

export { ruleSet as default }

export const ruleSet: IRuleSet = {
  documentationUrl: "https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md",
  rules: {
    noPasswordInPropertyName: {
      id: "R4033",
      category: "SDKViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
      resolved: true,
      given: "$.definitions.*",
      then: {
        fieldSelector: "$..properties.*~",
        options: {
          match: ".*Password.*"
        },
        execute: pattern
      }
    }
  }
}
