import { Resolver } from "@stoplight/json-ref-resolver"
import { Spectral } from "@stoplight/spectral-core"
import { DiagnosticSeverity } from "@stoplight/types"
import _ from "lodash"
import { spectralRulesets } from "../../index"

export function buildLinter(rulesets: any[], testedRuleName: string, useNoopResolver = false) {
  // Delete all rules except the tested rule
  rulesets.forEach((ruleset: any) => {
    Object.keys(ruleset.rules).forEach((ruleName: string) => {
      if (ruleName !== testedRuleName) {
        delete ruleset.rules[ruleName]
      }
    })
  })

  // Delete "stagingOnly", "rpcGuidelineCode" property for the same reasons as we do so in
  // packages/azure-openapi-validator/autorest/src/spectral-plugin-func.ts/getRuleSet
  rulesets.forEach((ruleset: any) => {
    Object.values(ruleset.rules).forEach((rule: any) => delete rule.stagingOnly)
  })

  rulesets.forEach((ruleset: any) => {
    Object.values(ruleset.rules).forEach((rule: any) => delete rule.rpcGuidelineCode)
  })

  const linter = useNoopResolver
    ? new Spectral({
        resolver: noopResolver(),
      })
    : new Spectral()

  linter.setRuleset({
    extends: rulesets,
    rules: {},
  })

  // Here we ensure the rule-to-be-unit-tested severity is set to 'error',
  // to ensure its unit tests will correctly execute.
  // Without this, if the rule is disabled in its definition by having
  // 'severity' set to 'off', then its unit tests would likely fail.
  linter.ruleset!.rules[testedRuleName].severity = DiagnosticSeverity.Error

  return linter
}

function linterForRule(ruleName: string, useNoopResolver = false): Spectral {
  return buildLinter(_.cloneDeep(Object.values(spectralRulesets)), ruleName, useNoopResolver)
}

function noopResolver(): Resolver {
  return new Resolver({
    getRef: () => {},
  })
}

export default linterForRule
