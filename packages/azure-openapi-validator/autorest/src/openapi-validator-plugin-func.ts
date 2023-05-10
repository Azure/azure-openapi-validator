import { lint, getOpenapiType, LintResultMessage, isExample, IRuleSet } from "@microsoft.azure/openapi-validator-core"
import { nativeRulesets } from "@microsoft.azure/openapi-validator-rulesets"
import { IAutoRestPluginInitiator } from "./jsonrpc/plugin-host"
import { convertLintMsgToAutoRestMsg, getOpenapiTypeStr, isCommonTypes } from "./plugin-common"
import { cachedFiles } from "."

export async function openapiValidatorPluginFunc(initiator: IAutoRestPluginInitiator): Promise<void> {
  const files = await (await initiator.ListInputs()).filter((f) => !isCommonTypes(f))
  const openapiType: string = await getOpenapiTypeStr(initiator)
  const sendMessage = (msg: LintResultMessage) => {
    initiator.Message(convertLintMsgToAutoRestMsg(msg))
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

  const defaultFleSystem = {
    read: readFile,
  }
  initiator.Message({
    Channel: "verbose",
    Text: `Validating '${files.join("\n")}'`,
  })
  try {
    const mergedRuleset = mergeRulesets(Object.values(nativeRulesets))
    await lint(files, { ruleSet: mergedRuleset, fileSystem: defaultFleSystem, openapiType: getOpenapiType(openapiType) }, sendMessage)
  } catch (e) {
    initiator.Message({
      Channel: "fatal",
      Text: `Failed validating:` + e,
    })
  }
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
