/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as assert from "assert"
import { safeLoad } from "js-yaml"
import { LinterResultMessage } from "../../types"
import { DocumentDependencyGraph } from "../../depsGraph"
import { JsonFormatter } from "../../formatter"
import { OpenApiTypes } from "../../types"
import { IRuleLoader, BuiltInRuleLoader } from "../../ruleLoader"
import ruleSet from "../../rulesets/legacy"
import { LintRunner } from "../../runner"
import { IRuleSet, RulesObject } from "../../types"
const fs = require("fs")
const path = require("path")
const pathToTestResources: string = "../../tests/resources/"

// run the validator and gather all the messages generated
export async function collectTestMessagesFromValidator(
  fileName: string,
  openapiType: OpenApiTypes,
  ruleName?: string
): Promise<LinterResultMessage[]> {
  const filePath = getFilePath(fileName)
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
    ruleLoader = new BuiltInRuleLoader()
  }
  const runner = new LintRunner(ruleLoader, graph, new JsonFormatter(graph))
  const messages = await runner.execute([filePath], { openapiType })
  return messages
}

// read the whole file into a string
function readFileAsString(file: string): string {
  return fs.readFileSync(file)
}

// assert whether we have the expected number of validation rules of given type
export function assertValidationRuleCount(messages: LinterResultMessage[], validationRule: string, count: number): void {
  assert.equal(messages.filter(msg => msg?.code === validationRule).length, count)
}

// get all the warning messages generated
export function getWarningMessages(messages: LinterResultMessage[]): LinterResultMessage[] {
  return messages.filter(msg => msg.type === "warning")
}

// get all the error messages generated
export function getErrorMessages(messages: LinterResultMessage[]): LinterResultMessage[] {
  return messages.filter(msg => msg.type === "error")
}

// get all the messages of a certain type of rule
export function getMessagesOfType(messages: LinterResultMessage[], validationRule: string): LinterResultMessage[] {
  return messages.filter(msg => msg.code === validationRule)
}

// read the open api doc in a usable object
export function readObjectFromFile(filePath: string): any {
  return safeLoad(readFileAsString(filePath))
}

export function getFilePath(fileName: string): string {
  return path.resolve(path.join(__dirname, pathToTestResources, fileName))
}
