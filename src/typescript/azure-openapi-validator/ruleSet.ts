import { pattern } from "./functions/pattern"
import { rules } from "./rule"
import { IRuleSet, RulesObject } from "./typeDeclaration"
// register rules
require("./rules/PageableOperation")
require("./rules/DescriptionMustNotBeNodeName")
require("./rules/ControlCharactersAreNotAllowed")
require("./rules/ArraySchemaMustHaveItems")
require("./rules/PostOperationIdContainsUrlVerb")
require("./rules/LicenseHeaderMustNotBeSpecified")
require("./rules/PathResourceProviderNamePascalCase")
require("./rules/PathResourceTypeNameCamelCase")
require("./rules/OperationIdRequired")
require("./rules/EnumMustRespectType")
require("./rules/EnumMustHaveType")
require("./rules/EnumUniqueValue")
require("./rules/EnumMustNotHaveEmptyValue")
require("./rules/IntegerTypeMustHaveFormat")
require("./rules/UniqueXmsEnumName")
require("./rules/DeprecatedXmsCodeGenerationSetting")
require("./rules/AvoidEmptyResponseSchema")
require("./rules/DefaultErrorResponseSchema")
require("./rules/DeleteOperationResponses")
require("./rules/XmsPageableMustHaveCorrespondingResponse")
require("./rules/RequiredReadOnlySystemData")
require("./rules/RequiredDefaultResponse")
require("./rules/GetCollectionResponseSchema")
require("./rules/AllResourcesMustHaveGetOperation")
require("./rules/NestedResourcesMustHaveListOperation")
require("./rules/TopLevelResourcesListByResourceGroup")
require("./rules/TopLevelResourcesListBySubscription")
require("./rules/OperationsApiResponseSchema")
require("./rules/Rpaas_CreateOperationAsyncResponseValidation")
require("./rules/PreviewVersionOverOneYear")
require("./rules/UniqueXmsExample")
require("./rules/UniqueClientParameterName")
require("./rules/ValidResponseCodeRequired")
require("./rules/Rpaas_ResourceProvisioningState")
require("./rules/AzureResourceTagsSchema")
require("./rules/UniqueModelName")
require("./rules/MissingXmsErrorResponse")
require("./rules/MissingTypeObject")
require("./rules/PrivateEndpointResourceSchemaValidation")
require("./rules/ImplementPrivateEndpointAPIs")
require("./rules/ParametersOrder")
require("./rules/ExtensionResourcePathPattern")
require("./rules/XmsEnumValidation")

export { ruleSet as default }

function createFromLegacyRules() {
  const legacyRules: RulesObject = {}
  for (const rule of rules) {
    legacyRules[rule.name] = rule
  }
  return legacyRules
}

export const legacyRules = createFromLegacyRules()

export const ruleSet: IRuleSet = {
  documentationUrl: "",
  rules: { ...legacyRules, test: { id: "R4014", category: "ARMViolation", severity: "error", appliesTo_JsonQuery: "", run: pattern } }
}
