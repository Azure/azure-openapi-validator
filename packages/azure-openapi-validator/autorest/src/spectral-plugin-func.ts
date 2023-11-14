/* eslint-disable import/no-duplicates */
import { fileURLToPath } from "url"
import { createFileOrFolderUri, resolveUri } from "@azure-tools/uri"
import { getOpenapiType, isUriAbsolute } from "@microsoft.azure/openapi-validator-core"
import { OpenApiTypes } from "@microsoft.azure/openapi-validator-core"
import { spectralRulesets } from "@microsoft.azure/openapi-validator-rulesets"
import { Resolver } from "@stoplight/json-ref-resolver"
import { Spectral, Ruleset } from "@stoplight/spectral-core"
import { DiagnosticSeverity } from "@stoplight/types"
import { safeLoad } from "js-yaml"
import { IAutoRestPluginInitiator } from "./jsonrpc/plugin-host"
import { JsonPath, Message } from "./jsonrpc/types"
import { convertLintMsgToAutoRestMsg, getOpenapiTypeStr, isCommonTypes } from "./plugin-common"
import { cachedFiles } from "."

export async function spectralPluginFunc(initiator: IAutoRestPluginInitiator): Promise<void> {
  initiator.Message({
    Channel: "information",
    Text: `spectralPluginFunc: Enter`,
  })

  const files: string[] = (await initiator.ListInputs()).filter((f) => !isCommonTypes(f))
  const openapiType: string = await getOpenapiTypeStr(initiator)
  const isStagingRun: boolean = await initiator.GetValue("is-staging-run")

  const readFile = async (fileUri: string) => {
    let file = cachedFiles.get(fileUri)
    if (!file) {
      file = await initiator.ReadFile(fileUri)
      if (!file) {
        throw new Error(`Could not read file: ${fileUri} .`)
      }
      cachedFiles.set(fileUri, file)
    }
    return file
  }

  const resolvedOpenapiType: OpenApiTypes = getOpenapiType(openapiType)
  
  // TODO verify this works
  const isTypespecGenerated: boolean = await initiator.GetValue("is-typespec-generated")
  const [ruleset, rulesetWithRpcGuidelineCode, namesOfRulesInStagingOnly]: [Ruleset, any, string[]] = await getRuleSet(resolvedOpenapiType)

  ifNotStagingRunThenDisableStagingOnlyRules(isStagingRun, initiator, ruleset, namesOfRulesInStagingOnly)

  printRuleNames(initiator, ruleset, resolvedOpenapiType)

  for (const file of files) {
    if (file.includes("common-types/resource-management")) {
      continue
    }

    const resolveFile = (uri: any) => {
      const ref = uri.href()
      const fileUri = isUriAbsolute(ref) ? ref : resolveUri(file, ref)
      const content = readFile(fileUri)
      return content
    }
    const resolver = new Resolver({
      resolvers: {
        file: {
          resolve: resolveFile,
        },
        http: {
          resolve: resolveFile,
        },
        https: {
          resolve: resolveFile,
        },
      },
    })
    const spectral = new Spectral({ resolver })
    spectral.setRuleset(ruleset)

    initiator.Message({
      Channel: "information",
      Text: `spectralPluginFunc: Validating '${file}'`,
    })

    try {
      const openapiDefinitionDocument = await readFile(file)
      const openapiDefinitionObject = safeLoad(openapiDefinitionDocument)
      const normalizedFile = file.startsWith("file:///") ? fileURLToPath(file) : file
      await runSpectral(rulesetWithRpcGuidelineCode, openapiDefinitionObject, normalizedFile, initiator.Message.bind(initiator), spectral)
    } catch (e) {
      catchSpectralRunErrors(file, e, initiator)
    }
  }

  initiator.Message({
    Channel: "information",
    Text: `spectralPluginFunc: Return`,
  })
}

function ifNotStagingRunThenDisableStagingOnlyRules(
  isStagingRun: boolean,
  initiator: IAutoRestPluginInitiator,
  ruleset: Ruleset,
  namesOfRulesInStagingOnly: string[]
) {
  if (isStagingRun) {
    initiator.Message({
      Channel: "information",
      Text: "Detected staging run. Running all enabled rules.",
    })
  } else {
    initiator.Message({
      Channel: "information",
      Text:
        "Detected production run. As a result, disabling all Spectral rules that are denoted to run only in staging. Names of rules being disabled: " +
        namesOfRulesInStagingOnly.join(", ") +
        ".",
    })
    Object.values(ruleset.rules).forEach((rule) => {
      if (namesOfRulesInStagingOnly.some((name) => rule.name == name)) {
        // This assignment will invoke the setter defined here:
        // https://github.com/stoplightio/spectral/blob/44c40e2b7c9ea6222054da8700049b0307cc5f8b/packages/core/src/ruleset/rule.ts#L121
        // Resulting in value of -1, as defined here:
        // https://github.com/stoplightio/spectral/blob/44c40e2b7c9ea6222054da8700049b0307cc5f8b/packages/ruleset-migrator/src/transformers/rules.ts#L39
        rule.severity = "off"
        // We must disable the rule to ensure it is not run at all. Spectral source for that is in [1].
        // Otherwise, if it throws due to a bug in rule implementation, it will result in fatal error.
        // Example of how a rule can thrown is given in [2].
        // Example where we disable a rule from running in production so it doesn't throw is given in [3].
        // Without this line, the fix in [3] doesn't help. For a proof of that, see [4] and its log, [5],
        // showing that a rule that is supposed to run in stagingOnly, still throws in production.
        // [1] https://github.com/stoplightio/spectral/blob/6d0991572f185ce5cf4031dc1d8eb4035b5eaf1d/packages/core/src/runner/runner.ts#L39
        // [2] https://github.com/Azure/azure-openapi-validator/pull/595
        // [3] https://github.com/Azure/azure-openapi-validator/pull/596
        // [4] https://github.com/Azure/azure-rest-api-specs/pull/26024
        // [5] https://dev.azure.com/azure-sdk/internal/_build/results?buildId=3125612&view=logs&j=0574a2a6-2d0a-5ec6-40e4-4c6e2f70bea2&t=80c3e782-49f0-5d1c-70dd-cbee57bdd0c7&l=252
        rule.enabled = false
      }
    })
  }
}

function printRuleNames(initiator: IAutoRestPluginInitiator, ruleset: Ruleset, resolvedOpenapiType: OpenApiTypes) {
  const ruleNames: string[] = Object.keys(ruleset.rules)
    // Case-insensitive sort.
    // Source: https://stackoverflow.com/a/60922998/986533
    .sort(Intl.Collator().compare)

  initiator.Message({
    Channel: "information",
    Text: `Loaded ${ruleNames.length} spectral rules, for OpenAPI type '${OpenApiTypes[resolvedOpenapiType]}':`,
  })
  for (const ruleName of ruleNames) {
    const severity: DiagnosticSeverity = ruleset.rules[ruleName].severity
    const sevStr: string = Number(severity) == -1 ? "DISABLED" : DiagnosticSeverity[severity]
    initiator.Message({
      Channel: "information",
      Text: (sevStr == "DISABLED" ? "DISABLED " : "").concat(`Spectral rule, severity '${sevStr}': '${ruleName}'`),
    })
  }
}

async function runSpectral(rulesetWithRpcGuidelineCode: any, doc: any, filePath: string, sendMessage: (m: Message) => void, spectral: any) {
  const mergedResults = []
  const convertSeverity = (severity: number) => {
    switch (severity) {
      case 0:
        return "error"
      case 1:
        return "warning"
      case 2:
        return "info"
      default:
        return "info"
    }
  }
  const convertRange = (range: any) => {
    return {
      start: {
        line: range.start.line + 1,
        column: range.start.character,
      },
      end: {
        line: range.end.line + 1,
        column: range.end.character,
      },
    }
  }

  // this function is added temporarily , should be remove after the autorest fix this issues.
  const removeXmsExampleFromPath = (paths: JsonPath) => {
    const index = paths.findIndex((item) => item === "x-ms-examples")
    if (index !== -1 && paths.length > index + 2) {
      return paths.slice(0, index + 2)
    }
    return paths
  }

  const format = (result: any, spec: string) => {
    return {
      rpcGuidelineCode: rulesetWithRpcGuidelineCode.rules[result.code]?.rpcGuidelineCode ?? "",
      code: result.code,
      message: result.message,
      type: convertSeverity(result.severity),
      jsonpath: result.path && result.path.length ? removeXmsExampleFromPath(result.path) : [],
      range: convertRange(result.range),
      sources: [`${spec}`],
      location: {
        line: result.range.start.line + 1,
        column: result.range.start.character,
      },
    }
  }
  const results = await spectral.run(doc)
  mergedResults.push(...results.map((result: any) => format(result, createFileOrFolderUri(filePath))))
  for (const message of mergedResults) {
    sendMessage(convertLintMsgToAutoRestMsg(message))
  }

  return mergedResults
}

export async function getRuleSet(
  openapiType: OpenApiTypes,
  isTypespecGenerated: boolean
): Promise<[ruleset: Ruleset, rulesetWithRpcGuidelineCode: any, namesOfRulesInStagingOnly: string[]]> {
  let ruleset: any
  switch (openapiType) {
    case OpenApiTypes.arm: {
      ruleset = spectralRulesets.azARM
      break
    }
    case OpenApiTypes.dataplane: {
      ruleset = spectralRulesets.azDataplane
      break
    }
    default: {
      ruleset = spectralRulesets.azCommon
    }
  }
  // Creating a copy of ruleset with rpcGuidelineCode field as we need it later to be included in the output
  const rulesetWithRpcGuidelineCode = JSON.parse(JSON.stringify(ruleset))
  // Delete "rpcGuidelineCode" custom property added by this source code
  // as it would fail validation when constructing @stoplight/spectral-core Ruleset downstream.
  Object.values(ruleset.rules).forEach((rule: any) => delete rule.rpcGuidelineCode)

  if (isTypespecGenerated) {
    ruleset = deleteRulesIgnoredByTypespec(ruleset)
  }

  const namesOfRulesInStagingOnly: string[] = processRulesInStagingOnly(ruleset.rules)

  return [new Ruleset(ruleset, { severity: "recommended" }), rulesetWithRpcGuidelineCode, namesOfRulesInStagingOnly]

  /**
   * Deletes rules from a ruleset that are deemed irrelevant to Typespec-generated Swagger.
   * @param ruleset The ruleset to be filtered.
   * @returns The ruleset with rules that are not applicable to Typespec removed.
   */
  function deleteRulesIgnoredByTypespec(ruleset: any) {
    const rulesByName: [string, any][] = Object.entries(ruleset.rules)
    const rulesApplicableToTypespecByName: [string, any][] = rulesByName.filter(([_, rule]) => rule?.ignoreForTypespec === false)
    // Here we delete the "ignoreForTypespec" property because it is a custom property added by this source code,
    // and thus would fail validation when constructing @stoplight/spectral-core Ruleset downstream.
    rulesApplicableToTypespecByName.forEach(([_, rule]) => delete rule.ignoreForTypespec)
    ruleset.rules = Object.fromEntries(rulesApplicableToTypespecByName)
    return ruleset
  }

  function processRulesInStagingOnly(rules: any) {
    const rulesByName: [string, any][] = Object.entries(rules)
    const rulesInStagingOnlyByName: [string, any][] = rulesByName.filter(([_, rule]) => rule?.stagingOnly === true)
    const namesOfRulesInStagingOnly: string[] = rulesInStagingOnlyByName.map(([name, _]) => name)
    // Here we delete the "stagingOnly" property because it is a custom property added by this source code,
    // and thus would fail validation when constructing @stoplight/spectral-core Ruleset downstream.
    rulesInStagingOnlyByName.forEach(([_, rule]) => delete rule.stagingOnly)
    return namesOfRulesInStagingOnly
  }
}

/** Spectral (from "@stoplight/spectral-core") may throw https://www.npmjs.com/package/es-aggregate-error
 * If so, we print out all the constituent errors.
 * For additional context, see: https://github.com/Azure/azure-sdk-tools/issues/6856
 */
function catchSpectralRunErrors(file: string, e: any, initiator: any) {
  // Initialize an array to collect error messages
  const errorMessages: string[] = [e]

  // Check if "e" contains the "errors" property
  if (e && e.errors && Array.isArray(e.errors)) {
    e.errors.forEach((error: any, index: number) => {
      // Push each error message into the array
      errorMessages.push(`Error ${index + 1}: ${error.message}`)
    })
  }

  // Combine all error messages with newlines
  const combinedErrorMessages = errorMessages.join("\n")

  // Call initiator.Message with the combined error message
  initiator.Message({
    Channel: "fatal",
    Text: `spectralPluginFunc: Failed validating: '${file}'. Errors encountered:\n${combinedErrorMessages}`,
  })
}
