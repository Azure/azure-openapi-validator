import { pattern } from "../functions/pattern"
import { MergeStates, OpenApiTypes, rules } from "../rule"
import { IRuleSet, RulesObject } from "../types"
// register rules
require("../rules/PageableOperation")
require("../rules/DescriptionMustNotBeNodeName")
require("../rules/ControlCharactersAreNotAllowed")
require("../rules/ArraySchemaMustHaveItems")
require("../rules/PostOperationIdContainsUrlVerb")
require("../rules/LicenseHeaderMustNotBeSpecified")
require("../rules/PathResourceProviderNamePascalCase")
require("../rules/PathResourceTypeNameCamelCase")
require("../rules/OperationIdRequired")
require("../rules/EnumMustRespectType")
require("../rules/EnumMustHaveType")
require("../rules/EnumUniqueValue")
require("../rules/EnumMustNotHaveEmptyValue")
require("../rules/IntegerTypeMustHaveFormat")
require("../rules/UniqueXmsEnumName")
require("../rules/DeprecatedXmsCodeGenerationSetting")
require("../rules/AvoidEmptyResponseSchema")
require("../rules/DefaultErrorResponseSchema")
require("../rules/DeleteOperationResponses")
require("../rules/XmsPageableMustHaveCorrespondingResponse")
require("../rules/RequiredReadOnlySystemData")
require("../rules/RequiredDefaultResponse")
require("../rules/GetCollectionResponseSchema")
require("../rules/AllResourcesMustHaveGetOperation")
require("../rules/NestedResourcesMustHaveListOperation")
require("../rules/TopLevelResourcesListByResourceGroup")
require("../rules/TopLevelResourcesListBySubscription")
require("../rules/OperationsApiResponseSchema")
require("../rules/Rpaas_CreateOperationAsyncResponseValidation")
require("../rules/Rpaas_DeleteOperationAsyncResponseValidation")
require("../rules/Rpaas_PostOperationAsyncResponseValidation")
require("../rules/Rpaas_ResourceProvisioningState")
require("../rules/PreviewVersionOverOneYear")
require("../rules/UniqueXmsExample")
require("../rules/UniqueClientParameterName")
require("../rules/ValidResponseCodeRequired")
require("../rules/AzureResourceTagsSchema")
require("../rules/UniqueModelName")
require("../rules/MissingXmsErrorResponse")
require("../rules/MissingTypeObject")
require("../rules/PrivateEndpointResourceSchemaValidation")
require("../rules/ImplementPrivateEndpointAPIs")
require("../rules/ParametersOrder")
require("../rules/ExtensionResourcePathPattern")
require("../rules/XmsEnumValidation")

export { defaultRuleSet as default }

function createFromLegacyRules() {
  const legacyRules: RulesObject = {}
  for (const rule of rules) {
    legacyRules[rule.name] = { ...rule, given: rule.appliesTo_JsonQuery, then: { execute: rule.run, options: {} } }
  }
  return legacyRules
}

export const legacyRules = createFromLegacyRules()

export const defaultRuleSet: IRuleSet = {
  documentationUrl: "https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md",
  rules: {
    ...legacyRules,
    noPasswordInPropertyName: {
      id: "R4033",
      category: "ARMViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
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
