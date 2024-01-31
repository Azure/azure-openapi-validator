import { IRuleSet, LintResultMessage, OpenApiTypes, getOpenapiType, isExample, lint } from "@microsoft.azure/openapi-validator-core"
import { nativeRulesets } from "@microsoft.azure/openapi-validator-rulesets"
import { IAutoRestPluginInitiator } from "./jsonrpc/plugin-host"
import { convertLintMsgToAutoRestMsg, getOpenapiTypeStr, isCommonTypes } from "./plugin-common"
import { cachedFiles } from "."

export async function openapiValidatorPluginFunc(initiator: IAutoRestPluginInitiator): Promise<void> {
  initiator.Message({
    Channel: "information",
    Text: `openapiValidatorPluginFunc: Enter`,
  })

  const files = await (await initiator.ListInputs()).filter((f) => !isCommonTypes(f))
  const openapiType: string = await getOpenapiTypeStr(initiator)
  const sendMessage = (msg: LintResultMessage) => {
    initiator.Message(convertLintMsgToAutoRestMsg(msg))
  }
  const log = (msg: string) => {
    initiator.Message({ Channel: "information", Text: msg })
  }

  const readFile = async (fileUri: string) => {
    if (isExample(fileUri)) {
      return ""
    }
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

  const defaultFileSystem = {
    read: readFile,
  }
  initiator.Message({
    Channel: "information",
    Text: `openapiValidatorPluginFunc: Validating '${files.join("\n")}'`,
  })
  try {
    const mergedRuleset: IRuleSet = mergeRulesets(Object.values(nativeRulesets))

    const resolvedOpenapiType = getOpenapiType(openapiType)

    printRuleNames(initiator, mergedRuleset, resolvedOpenapiType)

    await lint(files, { ruleSet: mergedRuleset, fileSystem: defaultFileSystem, openapiType: resolvedOpenapiType }, sendMessage, log)
  } catch (e) {
    initiator.Message({
      Channel: "fatal",
      Text: `openapiValidatorPluginFunc: Failed validating:` + e,
    })
  }

  initiator.Message({
    Channel: "information",
    Text: `openapiValidatorPluginFunc: Return`,
  })
}

const mergeRulesets = (rulesets: IRuleSet[]): IRuleSet => {
  let rules = {}
  rulesets.forEach((set) => {
    rules = {
      ...rules,
      ...set.rules,
    }
  })
  const mergedRuleSet: IRuleSet = {
    documentationUrl: "",
    rules,
  }
  return mergedRuleSet
}

function printRuleNames(initiator: IAutoRestPluginInitiator, ruleset: IRuleSet, resolvedOpenapiType: OpenApiTypes) {
  const ruleNames: string[] = Object.keys(ruleset.rules)
    // Case-insensitive sort.
    // Source: https://stackoverflow.com/a/60922998/986533
    .sort(Intl.Collator().compare)

  initiator.Message({
    Channel: "information",
    Text: `Loaded ${ruleNames.length} native & legacy rules, for OpenAPI type '${OpenApiTypes[resolvedOpenapiType]}':`,
  })
  for (const ruleName of ruleNames) {
    const severity: string = ruleset.rules[ruleName].severity
    initiator.Message({
      Channel: "information",
      Text: `Native or legacy rule, severity '${severity}': '${ruleName}'`,
    })
  }
}
