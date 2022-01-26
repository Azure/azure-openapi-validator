/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IRuleFunction, MergeStates, OpenApiTypes } from "./rule"

export type RuleThen = {
  options: any
  fieldSelector?: string
  execute: IRuleFunction
}

export interface IRule {
  readonly id: string // see rule ID
  readonly description?: string
  readonly category: "ARMViolation" | "OneAPIViolation" | "SDKViolation" | "RPaaSViolation"
  readonly openapiType: OpenApiTypes
  readonly mergeState?: MergeStates
  readonly severity: "error" | "warning"
  readonly given?: string | string[] // see https://github.com/JSONPath-Plus/JSONPath for syntax and samples , the strings to query data via jsonpath-plus.
  readonly then: RuleThen // the rule procession steps
}

export type RulesObject = { [key: string]: IRule }

export interface IRuleSet {
  documentationUrl: string
  rules: RulesObject
}

export type JsonPath = Array<string | number>
