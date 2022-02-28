/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { DocumentDependencyGraph } from "./depsGraph"
import { nodes } from "./jsonpath"
import { MergeStates, OpenApiTypes, ValidationMessage } from "./rule"
import ruleSet from "./rulesets/legacy"
import { IRule, IRuleSet, Message } from "./types"
import _ from "lodash"
import { LintRunner } from "./runner"
import { BuiltInRuleLoader } from "./ruleLoader"
import { JsonFormatter } from "./formatter"

export * from "./types"
export * from "./rule"
export * from "./depsGraph"
export * from "./jsonpath"
export * from "./rule"
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
