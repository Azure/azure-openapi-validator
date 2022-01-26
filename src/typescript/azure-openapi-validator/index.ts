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
import { LintRunner } from "./runner"
import { RuleLoader } from "./ruleLoader"
import { JsonFormatter } from "./formatter"

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
        const fieldSelector = rule.then.fieldSelector
        if (fieldSelector) {
          for (const subSection of nodes(section.value, fieldSelector)) {
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
            section.value,
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
  openapiType: OpenApiTypes
}

export async function runCli(swaggerPaths: string[], options: LintOptions) {
  const graph = new DocumentDependencyGraph()
  const rpFolder = options.rpFolder
  if (rpFolder) {
    await graph.generateGraph(rpFolder)
  }
  const loader = new RuleLoader()
  const formatter = new JsonFormatter(graph)
  const runner = new LintRunner(loader, graph, formatter)
  const msgs = await runner.execute(swaggerPaths, options)

  for (const msg of msgs) {
    console.log(msg)
  }
}
