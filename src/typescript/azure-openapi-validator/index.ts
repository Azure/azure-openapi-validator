/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { dirname, isAbsolute, join, normalize } from "path"
import { Message } from "../jsonrpc/types"
import { DocumentDependencyGraph } from "./depsGraph"
import { nodes, stringify } from "./jsonpath"
import { MergeStates, OpenApiTypes, ValidationMessage } from "./rule"
import ruleSet from "./rulesets/ruleSet"
import { IRule, IRuleSet } from "./typeDeclaration"

export const runRules = async (
  document: string,
  openapiDefinition: any,
  sendMessage: (m: Message) => void,
  openapiType: OpenApiTypes,
  mergeState: MergeStates,
  ruleset: IRuleSet,
  graph?: DocumentDependencyGraph
) => {
  const rulesToRun = Object.entries(ruleset.rules).filter(rule => rule[1].mergeState === mergeState && rule[1].openapiType & openapiType)
  for (const [ruleName, rule] of rulesToRun) {
    let givens = rule.given || "$"
    if (!Array.isArray(givens)) {
      givens = [givens]
    }
    for (const given of givens) {
      for (const section of nodes(openapiDefinition, given)) {
        for await (const message of rule.then.function(
          openapiDefinition,
          rule.then.appliesToKey ? section.property : section.value,
          section.path.slice(1),
          {
            specPath: document,
            graph
          },
          rule.then.options
        )) {
          calcResult(ruleName, rule, message)
        }
      }
    }
  }

  function calcResult(ruleName: string, rule: IRule, message: ValidationMessage) {
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

export async function runCli(swaggerPath: string, options: LintOptions) {
  const graph = new DocumentDependencyGraph()
  const rpFolder = options.rpFolder || join(dirname(swaggerPath), "../../..")
  await graph.generateGraph(rpFolder)
  const documentInstance = (await graph.loadDocument(swaggerPath)).getObj()

  const sendMessage = (msg: Message) => {
    const document = graph.getDocument(msg.Source[0].document)
    const path = (msg.Source[0].Position as any).path
    const pos = document.getPositionFromJsonPath(path)

    const jsonMsg = {
      sources: [msg.Source[0].document + `:${pos.line}:${pos.column}`],
      code: msg.Key[1],
      jsonpath: stringify(path),
      message: msg.Details,
      severity: msg.Channel
    }
    console.log(JSON.stringify(jsonMsg, null, 2))
  }

  await run(swaggerPath, documentInstance, sendMessage, getOpenapiTypes(options.openapiType), MergeStates.composed, graph)
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
