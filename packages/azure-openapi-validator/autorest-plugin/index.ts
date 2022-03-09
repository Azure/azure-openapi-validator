/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { safeLoad } from "js-yaml"
import { AutoRestPluginHost } from "./jsonrpc/plugin-host"
import { stringify} from "jsonpath"
import {getRuleSet} from "./loader"
import { Message } from "./jsonrpc/types"
import { dirname, join } from "path"
const { Spectral } = require("@stoplight/spectral-core")
const { Resolver } = require("@stoplight/spectral-ref-resolver");

async function runSpectral(doc:any,filePath:string, sendMessage: (m: Message) => void, linter:any) {

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

  const format = (result, spec) => {
    return {
      code: result.code,
      message: result.message,
      type: convertSeverity(result.severity),
      "jsonpath": stringify(result.path),
      range: convertRange(result.range),
      sources: [`${spec}:${result.range.start.line}:${result.range.start.character}`],
      location: {
        line: result.range.start.line + 1,
        column: result.range.start.character
      }
    }
  }
  const results = await linter.run(doc)
  mergedResults.push(...results.map(result => format(result, filePath)))
 for (const message of mergedResults) {
  sendMessage({
    Channel: message.type,
    Text: message.message,
    Key: [message.code],
    Source: [
      {
        document : message.sources[0],
        Position: { path: message["jsonpath"] }
      }
    ],
    Details: {
      type: message.type,
      code: message.code,
      message: message.message,
      id: message.code,
    }
  })

 }
  

  return mergedResults
}

async function main() {
  const pluginHost = new AutoRestPluginHost()
  pluginHost.Add("spectral", async initiator => {
    const files = await initiator.ListInputs()
    const mergeState: string = await initiator.GetValue("merge-state")
    const openapiType: string = await initiator.GetValue("openapi-type")
    let subType: string = await initiator.GetValue("openapi-subtype")

    const resolver = new Resolver({
      resolvers: {
        file: {
          async resolve(uri) {
            let ref = uri.href();
            return await readFile(ref);
          },
        },
      },
    });

    const cachedFiles = new Map<string,any>()
    const readFile = async (fileUri:string) => {
      let file = cachedFiles.get(fileUri)
      if (!file) {
        file = await initiator.ReadFile(fileUri)
        cachedFiles.set(fileUri,file)
      }
      return file
    }

    const linter = new Spectral({resolver})
    const rules = await getRuleSet()
    linter.setRuleset(rules)
    subType = subType === "providerHub" ? "rpaas" : subType
    for (const file of files) {
      initiator.Message({
        Channel: "verbose",
        Text: `Validating '${file}'`
      })

      try {
        const openapiDefinitionDocument = await readFile(file)
        const openapiDefinitionObject = safeLoad(openapiDefinitionDocument)
        runSpectral(openapiDefinitionObject,file, initiator.Message.bind(initiator),linter)
   
      } catch (e) {
        initiator.Message({
          Channel: "fatal",
          Text: `Failed validating: '${file}', error encountered: ` + e
        })
      }
    }
  })

  pluginHost.Add("openapi-validator", async initiator => {
    const files = await initiator.ListInputs()
    const mergeState: string = await initiator.GetValue("merge-state")
    const openapiType: string = await initiator.GetValue("openapi-type")
    let subType: string = await initiator.GetValue("openapi-subtype")

    const resolver = new Resolver({
      resolvers: {
        file: {
          async resolve(uri) {
            let ref = uri.href();
            return await readFile(ref);
          },
        },
      },
    });

    const cachedFiles = new Map<string,any>()
    const readFile = async (fileUri:string) => {
      let file = cachedFiles.get(fileUri)
      if (!file) {
        file = await initiator.ReadFile(fileUri)
        cachedFiles.set(fileUri,file)
      }
      return file
    }

    const linter = new Spectral({resolver})
    const rules = await getRuleSet()
    linter.setRuleset(rules)
    subType = subType === "providerHub" ? "rpaas" : subType
    for (const file of files) {
      initiator.Message({
        Channel: "verbose",
        Text: `Validating '${file}'`
      })

      try {
        const openapiDefinitionDocument = await readFile(file)
        const openapiDefinitionObject = safeLoad(openapiDefinitionDocument)
        runSpectral(openapiDefinitionObject,file, initiator.Message.bind(initiator),linter)
   
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
