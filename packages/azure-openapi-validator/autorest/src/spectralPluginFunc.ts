import { fileURLToPath } from "url"
import { createFileOrFolderUri, resolveUri } from "@azure-tools/uri"
import { getOpenapiType, isUriAbsolute } from "@microsoft.azure/openapi-validator-core"
import { Resolver } from "@stoplight/json-ref-resolver"
import { safeLoad } from "js-yaml"
import { getRuleSet } from "./loader"
const { Spectral } = require("@stoplight/spectral-core")
import { cachedFiles } from "."
import { IAutoRestPluginInitiator } from "./jsonrpc/plugin-host"
import { JsonPath, Message } from "./jsonrpc/types"
import { convertLintMsgToAutoRestMsg, getOpenapiTypeStr, isCommonTypes } from "./pluginCommon"

export async function spectralPluginFunc(initiator: IAutoRestPluginInitiator): Promise<void> {
  const files = (await initiator.ListInputs()).filter((f) => !isCommonTypes(f))
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

  const rules = await getRuleSet(getOpenapiType(openapiType))
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
    spectral.setRuleset(rules)

    initiator.Message({
      Channel: "verbose",
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

export async function runSpectral(doc: any, filePath: string, sendMessage: (m: Message) => void, spectral: any) {
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
