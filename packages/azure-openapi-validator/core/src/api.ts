/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { SwaggerInventory } from "./swaggerInventory"
import {IRuleSet, LintResultMessage, OpenApiTypes, RulesObject, IFileSystem } from "./types"
import _ from "lodash"
import { LintRunner } from "./runner"
import { JsonFormatter } from "./formatter"

export type LintOptions = {
  ruleSet:IRuleSet,
  openapiType: OpenApiTypes
  rpFolder?: string
  fileSystem?:IFileSystem
}
export type LintCallBack = (msg:LintResultMessage)=>void

export async function lint( swaggerPaths: string[],options: LintOptions,cb?:LintCallBack):Promise<LintResultMessage[]> {
  const inventory = new SwaggerInventory(options?.fileSystem)
  const rpFolder = options?.rpFolder
  if (rpFolder) {
    await inventory.generateGraph(rpFolder)
  }
  const ruleLoader = { getRuleSet: () => options.ruleSet }
  const formatter = new JsonFormatter(inventory)
  const runner = new LintRunner(ruleLoader, inventory, formatter)
  const msgs = await runner.execute(swaggerPaths, options,cb)
  return msgs
}

export async function LintTester(
  sampleFilePath: string,
  ruleSet:IRuleSet,
  ruleName?: string,
  fileSystem?:IFileSystem
): Promise<LintResultMessage[]> {
  let openapiType = OpenApiTypes.arm | OpenApiTypes.dataplane | OpenApiTypes.rpaas
  if (ruleName) {
    const rules: RulesObject = {}
    if (!ruleSet.rules[ruleName]) {
      throw new Error(`Rule ${ruleName} was not found.`)
    }
    rules[ruleName] = ruleSet.rules[ruleName]
    const singleRuleSet: IRuleSet = { documentationUrl: "", rules }
    return await lint([sampleFilePath],{ruleSet:singleRuleSet,openapiType,fileSystem})
  }
  return await lint([sampleFilePath],{ruleSet,openapiType,fileSystem})
}

