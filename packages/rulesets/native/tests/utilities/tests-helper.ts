/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as assert from "assert"
import { safeLoad } from "js-yaml"
import { LintResultMessage,OpenApiTypes, LintTester} from "@microsoft.azure/openapi-validator-core"
import {ruleSet as legacy} from "../../rulesets/legacy"
import {ruleSet as arm} from "../../rulesets/arm"
import { IRuleSet, RulesObject } from "@microsoft.azure/openapi-validator-core"
const fs = require("fs")
const path = require("path")
const pathToTestResources = "../../tests/resources/"

function getRule(name:string) {
  let rule = undefined;
  [arm, legacy].forEach(ruleset => {
    if (Object.keys(ruleset.rules).includes(name)) {
      rule = ruleset.rules[name]
      return false
    }
  })
  return rule
}

// run the validator and gather all the messages generated
export async function collectTestMessagesFromValidator(
  fileName: string,
  openapiType: OpenApiTypes,
  ruleName: string
): Promise<LintResultMessage[]> {
  const filePath = getFilePath(fileName)
  if (ruleName) {
    const rules: RulesObject = {}
    const rule = getRule(ruleName)
    if (!rule) {
      throw new Error(`Rule ${ruleName} was not found.`)
    }
    rules[ruleName] = rule
    const singleRuleSet: IRuleSet = { documentationUrl: "", rules }
    return LintTester(filePath,singleRuleSet,ruleName)
  } 
  return []
}

// read the whole file into a string
function readFileAsString(file: string): string {
  return fs.readFileSync(file)
}

// assert whether we have the expected number of validation rules of given type
export function assertValidationRuleCount(messages: LintResultMessage[], validationRule: string, count: number): void {
  assert.equal(messages.filter(msg => msg?.code === validationRule).length, count)
}

// get all the warning messages generated
export function getWarningMessages(messages: LintResultMessage[]): LintResultMessage[] {
  return messages.filter(msg => msg.type === "warning")
}

// get all the error messages generated
export function getErrorMessages(messages: LintResultMessage[]): LintResultMessage[] {
  return messages.filter(msg => msg.type === "error")
}

// get all the messages of a certain type of rule
export function getMessagesOfType(messages: LintResultMessage[], validationRule: string): LintResultMessage[] {
  return messages.filter(msg => msg.code === validationRule)
}

// read the open api doc in a usable object
export function readObjectFromFile(filePath: string): any {
  return safeLoad(readFileAsString(filePath))
}

export function getFilePath(fileName: string): string {
  return path.resolve(path.join(__dirname, pathToTestResources, fileName))
}
