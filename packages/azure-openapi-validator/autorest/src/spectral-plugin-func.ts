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
  const [ruleset, namesOfRulesInStagingOnly]: [Ruleset, string[]] = await getRuleSet(resolvedOpenapiType)

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
      await runSpectral(openapiDefinitionObject, normalizedFile, initiator.Message.bind(initiator), spectral)
    } catch (e) {
      initiator.Message({
        Channel: "fatal",
        Text: `spectralPluginFunc: Failed validating: '${file}', error encountered: ` + e,
      })
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

async function runSpectral(doc: any, filePath: string, sendMessage: (m: Message) => void, spectral: any) {
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

export async function getRuleSet(openapiType: OpenApiTypes): Promise<[ruleset: Ruleset, namesOfRulesInStagingOnly: string[]]> {
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

  const namesOfRulesInStagingOnly: string[] = processRulesInStagingOnly(ruleset.rules)

  return [new Ruleset(ruleset, { severity: "recommended" }), namesOfRulesInStagingOnly]

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
