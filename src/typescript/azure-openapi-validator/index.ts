/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Message } from "../jsonrpc/types"
import { DocumentDependencyGraph } from "./depsGraph"
import { OpenapiDocument } from "./document"
import { nodes, stringify } from "./jsonpath"
import { MergeStates, OpenApiTypes, ValidationMessage } from "./rule"
import ruleSet from "./rulesets/default"
import { IRule, IRuleSet } from "./types"
import _ from "lodash"

export const runRules = async (
  document: string,
  openapiDefinition: any,
  sendMessage: (m: Message) => void,
  openapiType: OpenApiTypes,
  mergeState: MergeStates,
  ruleset: IRuleSet,
  graph?: DocumentDependencyGraph
) => {
  const rulesToRun = Object.entries(ruleset.rules).filter(
    rule => (!rule[1].mergeState || rule[1].mergeState === mergeState) && rule[1].openapiType & openapiType
  )
  for (const [ruleName, rule] of rulesToRun) {
    let givens = rule.given || "$"
    if (!Array.isArray(givens)) {
      givens = [givens]
    }
    for (const given of givens) {
      for (const section of nodes(openapiDefinition, given)) {
        const subPath = rule.then.subPath
        if (subPath) {
          for (const subSection of nodes(section.value, subPath)) {
            for await (const message of rule.then.execute(
              openapiDefinition,
              subSection.value,
              section.path.slice(1).concat(subSection.path.slice(1)),
              {
                specPath: document,
                graph
              },
              rule.then.options
            )) {
              emitResult(ruleName, rule, message)
            }
          }
        } else {
          for await (const message of rule.then.execute(
            openapiDefinition,
            rule.then.subPath ? section.property : section.value,
            section.path.slice(1),
            {
              specPath: document,
              graph
            },
            rule.then.options
          )) {
            emitResult(ruleName, rule, message)
          }
        }
      }
    }
  }

  function emitResult(ruleName: string, rule: IRule, message: ValidationMessage) {
    const readableCategory = rule.category

    // try to extract provider namespace and resource type
    const path = message.location[1] === "paths" && message.location[2]
    const pathComponents = typeof path === "string" && path.split("/")
    const pathComponentsProviderIndex = pathComponents && pathComponents.indexOf("providers")
    const pathComponentsTail =
      pathComponentsProviderIndex && pathComponentsProviderIndex >= 0 && pathComponents.slice(pathComponentsProviderIndex + 1)
    const pathComponentProviderNamespace = pathComponentsTail && pathComponentsTail[0]
    const pathComponentResourceType = pathComponentsTail && pathComponentsTail[1]

    sendMessage({
      Channel: rule.severity,
      Text: message.message,
      Key: [ruleName, rule.id, readableCategory],
      Source: [
        {
          document,
          Position: { path: message.location }
        }
      ],
      Details: {
        type: rule.severity,
        code: ruleName,
        message: message.message,
        id: rule.id,
        validationCategory: readableCategory,
        providerNamespace: pathComponentProviderNamespace,
        resourceType: pathComponentResourceType
      }
    })
  }
}

export async function run(
  document: string,
  openapiDefinition: any,
  sendMessage: (m: Message) => void,
  openapiType: OpenApiTypes,
  mergeState: MergeStates,
  graph?: DocumentDependencyGraph
) {
  await runRules(document, openapiDefinition, sendMessage, openapiType, mergeState, ruleSet, graph)
}

export type LintOptions = {
  rpFolder?: string
  openapiType: string
}

export async function runCli(swaggerPaths: string[], options: LintOptions) {
  const graph = new DocumentDependencyGraph()
  const rpFolder = options.rpFolder
  if (rpFolder) {
    await graph.generateGraph(rpFolder)
  }
  const specsPromises = []
  for (const spec of swaggerPaths) {
    specsPromises.push(graph.loadDocument(spec))
  }
  const documents = (await Promise.all(specsPromises)) as OpenapiDocument[]
  const messages = new Set<string>()
  const sendMessage = (msg: Message) => {
    const document = graph.getDocument(msg.Source[0].document)
    let path = (msg.Source[0].Position as any).path
    if (path[0] === "$") {
      path = path.slice(1)
    }
    const pos = document.getPositionFromJsonPath(path)

    const jsonMsg = {
      ...msg.Details,
      sources: [msg.Source[0].document + `:${pos.line}:${pos.column}`],
      "json-path": stringify(path)
    }
    const serializedJson = JSON.stringify(jsonMsg, null, 2)
    if (!messages.has(serializedJson)) {
      console.log(serializedJson)
      messages.add(serializedJson)
    }
  }
  const runPromises = []
  for (const doc of documents) {
    const promise = run(doc.getDocumentPath(), doc.getObj(), sendMessage, getOpenapiTypes(options.openapiType), MergeStates.composed, graph)
    runPromises.push(promise)
  }
  await Promise.all(runPromises)
}

function getOpenapiTypes(type: string) {
  switch (type) {
    case "arm": {
      return OpenApiTypes.arm
    }
    case "data-plane": {
      return OpenApiTypes.dataplane
    }
    default:
      return OpenApiTypes.default
  }
}
