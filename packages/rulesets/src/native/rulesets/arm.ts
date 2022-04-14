import { OpenApiTypes , IRuleSet } from "@microsoft.azure/openapi-validator-core"

import { pattern } from "../functions/pattern"

export const armRuleset: IRuleSet = {
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
        fieldMatch: "$..properties.*~",
        options: {
          match: ".*Password.*"
        },
        execute: pattern
      }
    }
  }
}

export default armRuleset