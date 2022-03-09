/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { DocumentDependencyGraph } from "./depsGraph"
import {IRuleSet, LinterResultMessage, OpenApiTypes, RulesObject,  } from "./types"
import _ from "lodash"
import { LintRunner } from "./runner"
import { BuiltInRuleLoader, IRuleLoader } from "./ruleLoader"
import { JsonFormatter } from "./formatter"

export * from "./types"
export * from "./depsGraph"
export * from "./jsonpath"
export * from "./runner"

export type LintOptions = {
  rpFolder?: string
  openapiType: OpenApiTypes
}

export async function lint(swaggerPaths: string[], options: LintOptions) {
  const graph = new DocumentDependencyGraph()
  const rpFolder = options.rpFolder
  if (rpFolder) {
    await graph.generateGraph(rpFolder)
  }
  const loader = new BuiltInRuleLoader()
  const formatter = new JsonFormatter(graph)
  const runner = new LintRunner(loader, graph, formatter)
  const msgs = await runner.execute(swaggerPaths, options)
  return msgs
}

export async function LintTester(
  sampleFilePath: string,
  ruleSet:IRuleSet,
  ruleName?: string
): Promise<LinterResultMessage[]> {
  const graph = new DocumentDependencyGraph()
  let ruleLoader: IRuleLoader
  if (ruleName) {
    const rules: RulesObject = {}
    if (!ruleSet.rules[ruleName]) {
      throw new Error(`Rule ${ruleName} was not found.`)
    }
    rules[ruleName] = ruleSet.rules[ruleName]
    const singleRuleSet: IRuleSet = { documentationUrl: "", rules }
    ruleLoader = { getRuleSet: () => singleRuleSet }
  } else {
    ruleLoader = { getRuleSet: () => ruleSet }
  }
  const runner = new LintRunner(ruleLoader, graph, new JsonFormatter(graph))
  const messages = await runner.execute([sampleFilePath], { openapiType:OpenApiTypes.arm | OpenApiTypes.dataplane })
  return messages
}

