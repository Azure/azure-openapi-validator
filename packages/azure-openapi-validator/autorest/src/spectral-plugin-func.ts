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
  const files: string[] = (await initiator.ListInputs()).filter((f) => !isCommonTypes(f))
  const openapiType: string = await getOpenapiTypeStr(initiator)

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
  const ruleset: Ruleset = await getRuleSet(resolvedOpenapiType)

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
      Text: `Validating '${file}'`,
    })

    try {
      const openapiDefinitionDocument = await readFile(file)
      const openapiDefinitionObject = safeLoad(openapiDefinitionDocument)
      const normolizedFile = file.startsWith("file:///") ? fileURLToPath(file) : file
      await runSpectral(openapiDefinitionObject, normolizedFile, initiator.Message.bind(initiator), spectral)
    } catch (e) {
      initiator.Message({
        Channel: "fatal",
        Text: `Failed validating: '${file}', error encountered: ` + e,
      })
    }
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

export async function getRuleSet(openapiType: OpenApiTypes): Promise<Ruleset> {
  let ruleset
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

  return new Ruleset(ruleset, { severity: "recommended" })
  /*const ruleset = await bundleRuleset(rulesetFile, {
        target: 'node',
        format: 'commonjs',
        plugins: [builtins(), commonjs(), ...node({ fs, fetch })],
      });
  return  new Ruleset(load(ruleset,rulesetFile), {
    severity: 'recommended',
    source: rulesetFile,
  }); */
}
