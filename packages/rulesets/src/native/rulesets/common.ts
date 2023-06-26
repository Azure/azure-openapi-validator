import { rules, IRuleSet, RulesObject } from "@microsoft.azure/openapi-validator-core"
// register rules
require("../legacyRules/PageableOperation")
require("../legacyRules/DescriptionMustNotBeNodeName")
require("../legacyRules/ControlCharactersAreNotAllowed")
require("../legacyRules/ArraySchemaMustHaveItems")
require("../legacyRules/PostOperationIdContainsUrlVerb")
require("../legacyRules/LicenseHeaderMustNotBeSpecified")
require("../legacyRules/PathResourceProviderNamePascalCase")
require("../legacyRules/PathResourceTypeNameCamelCase")
require("../legacyRules/OperationIdRequired")
require("../legacyRules/EnumMustRespectType")
require("../legacyRules/EnumMustHaveType")
require("../legacyRules/EnumUniqueValue")
require("../legacyRules/EnumMustNotHaveEmptyValue")
require("../legacyRules/IntegerTypeMustHaveFormat")
require("../legacyRules/UniqueXmsEnumName")
require("../legacyRules/DeprecatedXmsCodeGenerationSetting")
require("../legacyRules/AvoidEmptyResponseSchema")
require("../legacyRules/DefaultErrorResponseSchema")
require("../legacyRules/DeleteOperationResponses")
require("../legacyRules/XmsPageableMustHaveCorrespondingResponse")
require("../legacyRules/RequiredReadOnlySystemData")
require("../legacyRules/RequiredDefaultResponse")
require("../legacyRules/GetCollectionResponseSchema")
require("../legacyRules/AllResourcesMustHaveGetOperation")
require("../legacyRules/NestedResourcesMustHaveListOperation")
require("../legacyRules/TopLevelResourcesListByResourceGroup")
require("../legacyRules/TopLevelResourcesListBySubscription")
require("../legacyRules/CreateOperationAsyncResponseValidation")
require("../legacyRules/Rpaas_ResourceProvisioningState")
require("../legacyRules/PreviewVersionOverOneYear")
require("../legacyRules/UniqueXmsExample")
require("../legacyRules/UniqueClientParameterName")
require("../legacyRules/ValidResponseCodeRequired")
require("../legacyRules/AzureResourceTagsSchema")
require("../legacyRules/UniqueModelName")
require("../legacyRules/MissingXmsErrorResponse")
require("../legacyRules/MissingTypeObject")
require("../legacyRules/PrivateEndpointResourceSchemaValidation")
require("../legacyRules/ParametersOrder")
require("../legacyRules/ExtensionResourcePathPattern")
require("../legacyRules/XmsEnumValidation")
require("../legacyRules/XmsIdentifierValidation")

function createFromLegacyRules() {
  const legacyRules: RulesObject = {}
  for (const rule of rules) {
    legacyRules[rule.name] = { ...rule, given: rule.appliesTo_JsonQuery, then: { execute: rule.run as any, options: {} } }
  }
  return legacyRules
}

export const legacyRules = createFromLegacyRules()

export const commonRuleset: IRuleSet = {
  documentationUrl: "https://github.com/Azure/azure-openapi-validator/blob/develop/docs/rules.md",
  rules: {
    ...legacyRules,
  },
}

export default commonRuleset
