/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as assert from "assert"
import { safeLoad } from "js-yaml"
import { run, runRules } from "../../../azure-openapi-validator"
import { Message } from "../../../jsonrpc/types"
import { DocumentDependencyGraph } from "../../depsGraph"
import { IFormatter, JsonFormatter } from "../../formatter"
import { MergeStates, OpenApiTypes, rules } from "../../rule"
import { RuleLoader } from "../../ruleLoader"
import ruleSet from "../../rulesets/default"
import { getOpenapiTypes, LintRunner } from "../../runner"
import { IRuleSet, RulesObject } from "../../types"
const fs = require("fs")
const path = require("path")
const pathToTestResources: string = "../../tests/resources/"

// run the validator and gather all the messages generated
export async function collectTestMessagesFromValidator(fileName: string, openapiType: OpenApiTypes, ruleName?: string): Promise<Message[]> {
  const filePath = getFilePath(fileName)
  const graph = new DocumentDependencyGraph()
  let ruleLoader: RuleLoader
  if (ruleName) {
    const rules: RulesObject = {}
    rules[ruleName] = ruleSet.rules[ruleName]
    const singleRuleSet: IRuleSet = { documentationUrl: "", rules }
    ruleLoader = { getRuleSet: () => singleRuleSet }
  } else {
    ruleLoader = new RuleLoader()
  }
  const runner = new LintRunner(ruleLoader, graph, {
    format: msg => {
      return msg
    }
  } as IFormatter<Message>)
  const messages = await runner.execute([filePath], { openapiType })
  return messages
}

// read the whole file into a string
function readFileAsString(file: string): string {
  return fs.readFileSync(file)
}

// assert whether we have the expected number of validation rules of given type
export function assertValidationRuleCount(messages: Message[], validationRule: string, count: number): void {
  assert.equal(messages.filter(msg => msg?.Details?.code === validationRule).length, count)
}

// get all the warning messages generated
export function getWarningMessages(messages: Message[]): Message[] {
  return messages.filter(msg => msg.Channel === "warning")
}

// get all the error messages generated
export function getErrorMessages(messages: Message[]): Message[] {
  return messages.filter(msg => msg.Channel === "error")
}

// get all the messages of a certain type of rule
export function getMessagesOfType(messages: Message[], validationRule: string): Message[] {
  return messages.filter(msg => msg.Details.name === validationRule)
}

// read the open api doc in a usable object
export function readObjectFromFile(filePath: string): any {
  return safeLoad(readFileAsString(filePath))
}

export function getFilePath(fileName: string): string {
  return path.resolve(path.join(__dirname, pathToTestResources, fileName))
}
