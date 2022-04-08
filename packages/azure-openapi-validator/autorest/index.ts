/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { safeLoad } from "js-yaml"
import { AutoRestPluginHost } from "./jsonrpc/plugin-host"
import {getRuleSet} from "./loader"
import { JsonPath, Message } from "./jsonrpc/types"
const { Spectral } = require("@stoplight/spectral-core")
import {lint, getOpenapiType, LintResultMessage, isUriAbsolute} from "@microsoft.azure/openapi-validator-core"
import {nativeRulesets} from "@microsoft.azure/openapi-validator-rulesets"
import {mergeRulesets} from "./loader"
import { fileURLToPath } from 'url';
import { createFileOrFolderUri, resolveUri } from "@azure-tools/uri";
import {Resolver} from "@stoplight/json-ref-resolver"

const cachedFiles = new Map<string,any>()

function convertLintMsgToAutoRestMsg(message:LintResultMessage):Message {
  // try to extract provider namespace and resource type
  const path = message.jsonpath?.[1] === "paths" && message.jsonpath[2]
  const pathComponents = typeof path === "string" && path.split("/")
  const pathComponentsProviderIndex = pathComponents && pathComponents.indexOf("providers")
  const pathComponentsTail =
    pathComponentsProviderIndex && pathComponentsProviderIndex >= 0 && pathComponents.slice(pathComponentsProviderIndex + 1)
  const pathComponentProviderNamespace = pathComponentsTail && pathComponentsTail[0]
  const pathComponentResourceType = pathComponentsTail && pathComponentsTail[1]
  const msg = {
    Channel: message.type,
    Text: message.message,
    Key: [message.code],
    Source: [
      {
        document : message?.sources?.[0] || "",
        Position: {
          path: message.jsonpath,
          //...message.range?.start as Position
        }
      }
    ],
    Details: {
      jsonpath:message.jsonpath,
      validationCategory: message.category,
      providerNamespace: pathComponentProviderNamespace,
      resourceType: pathComponentResourceType,
      range: message.range,
    }
  }
  return msg
}

async function runSpectral(doc:any,filePath:string, sendMessage: (m: Message) => void, spectral:any) {

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
        column: range.start.character
      },
      end: {
        line: range.end.line + 1,
        column: range.end.character
      }
    }
  }

  // this function is added temporarily , should be remove after the autorest fix this issues.
  const removeXmsExampleFromPath = (paths:JsonPath) => {
    const index = paths.findIndex(item => item === "x-ms-examples")
    if (index !== -1 && paths.length > index+2) {
      return paths.slice(0,index+2)
    }
    return paths
  }

  const format = (result:any, spec:string) => {

    return {
      code: result.code,
      message: result.message,
      type: convertSeverity(result.severity),
      jsonpath: result.path && result.path.length ? removeXmsExampleFromPath(result.path) : [],
      range: convertRange(result.range),
      sources: [`${spec}`],
      location: {
        line: result.range.start.line + 1,
        column: result.range.start.character
      }
    }
  }
  const results = await spectral.run(doc)
  mergedResults.push(...results.map((result:any) => format(result, createFileOrFolderUri(filePath))))
  for (const message of mergedResults) {
    sendMessage(convertLintMsgToAutoRestMsg(message))
  }

  return mergedResults
}

function isCommonTypes(filePath:string) {
  const regex = new RegExp(/.*common\-types\/resource\-management\/v.*.json/)
  return regex.test(filePath)
}

async function getOpenapiTypeStr(initiator:any) {
  let openapiType: string = await initiator.GetValue("openapi-type")
  let subType: string = await initiator.GetValue("openapi-subtype")
  subType = subType === "providerHub" ? "rpaas" : subType
  if (subType === "rpaas") {
    openapiType = "rpaas"
  }
  return openapiType
}


async function main() {
  const pluginHost = new AutoRestPluginHost()
  pluginHost.Add("openapi-validator", async initiator => {
    const files = await (await initiator.ListInputs()).filter(f => !isCommonTypes(f))
    const openapiType: string = await getOpenapiTypeStr(initiator)
    const sendMessage = (msg:LintResultMessage)=> {
        initiator.Message(convertLintMsgToAutoRestMsg(msg))
    }

    const readFile = async (fileUri:string) => {
      let file = cachedFiles.get(fileUri)
      if (!file) {
        file = await initiator.ReadFile(fileUri)
        cachedFiles.set(fileUri,file)
      }
      return file
    }

    const defaultFleSystem = {
       read: readFile
    }
    initiator.Message({
      Channel: "verbose",
      Text: `Validating '${files.join("\n")}'`
    })
    try {
      const mergedRuleset = mergeRulesets(Object.values(nativeRulesets))
      await lint(files,{ruleSet:mergedRuleset, fileSystem:defaultFleSystem,openapiType:getOpenapiType(openapiType)},sendMessage)
    } catch (e) {
      initiator.Message({
        Channel: "fatal",
        Text: `Failed validating:` + e
      })
    }
  })

  pluginHost.Add("spectral", async initiator => {
    const files = (await initiator.ListInputs()).filter(f => !isCommonTypes(f))
    const openapiType: string = await getOpenapiTypeStr(initiator)
    
     const readFile = async (fileUri:string) => {
      let file = cachedFiles.get(fileUri)
      if (!file) {
        file = await initiator.ReadFile(fileUri)
        if (!file) {
          throw new Error(`Could not read file: ${fileUri} .`)
        }
        cachedFiles.set(fileUri,file)
      }
      return file
    }

   
    
    const rules = await getRuleSet(getOpenapiType(openapiType))
    for (const file of files) {
      if (file.includes("common-types/resource-management")) {
        continue
      }

      const resolveFile = (uri:any) =>{
      const ref = uri.href();
      const fileUri = isUriAbsolute(ref) ? ref : resolveUri(file,ref)
      const content = readFile(fileUri);
      return content
    }
      const resolver = new Resolver({
      resolvers: {
        file: {
          resolve: resolveFile
        },
        http: {
          resolve: resolveFile
        },
        https:{
           resolve: resolveFile
        }
      },
    }); 

   
     const spectral = new Spectral({resolver})
     spectral.setRuleset(rules)

      initiator.Message({
        Channel: "verbose",
        Text: `Validating '${file}'`
      })

      try {
        const openapiDefinitionDocument = await readFile(file)
        const openapiDefinitionObject = safeLoad(openapiDefinitionDocument)
        const normolizedFile = file.startsWith("file:///") ? fileURLToPath(file) : file
        await runSpectral(openapiDefinitionObject,normolizedFile, initiator.Message.bind(initiator),spectral)
   
      } catch (e) {
        initiator.Message({
          Channel: "fatal",
          Text: `Failed validating: '${file}', error encountered: ` + e
        })
      }
    }
  })

  await pluginHost.Run()
}

main()
