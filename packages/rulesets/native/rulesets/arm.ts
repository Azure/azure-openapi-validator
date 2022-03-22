import { pattern } from "../functions/pattern"
import {operationApis } from "../functions/operationsApi"
import { OpenApiTypes } from "@microsoft.azure/openapi-validator-core"
import { IRuleSet } from "@microsoft.azure/openapi-validator-core"

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
    },
    operationsApi: {
      id: "R4034",
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
      resolved: true,
      given: ["$.paths"],
      then: {
        options: {
        },
        execute: operationApis
      }
    }
  }
}
