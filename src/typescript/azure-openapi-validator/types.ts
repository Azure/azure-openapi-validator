/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IRuleFunction, MergeStates, OpenApiTypes } from "./rule"

export type RuleThen = {
  options: any
  appliesToKey?: boolean
  function: IRuleFunction
}

export interface IRule {
  readonly id: string // see Rxxx/Sxxx codes on https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md
  readonly description?: string
  readonly category: "ARMViolation" | "OneAPIViolation" | "SDKViolation" | "RPaaSViolation"
  readonly openapiType: OpenApiTypes
  readonly mergeState?: MergeStates
  readonly severity: "error" | "warning"
  readonly given?: string | string[] // see https://github.com/JSONPath-Plus/JSONPath for syntax and samples
  then: RuleThen // the rule procession steps
}

export type RulesObject = { [key: string]: IRule }

export interface IRuleSet {
  documentationUrl: string
  rules: RulesObject
}

export type JsonPath = Array<string | number>
