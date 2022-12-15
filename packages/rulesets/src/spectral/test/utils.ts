import { Resolver } from "@stoplight/json-ref-resolver"
import { Spectral } from "@stoplight/spectral-core"
import _ from "lodash"
import { spectralRulesets } from "../../index"

export function buildLinter(ruleset: any, rule: string, useNoopResolver = false) {
  const omitRule = (extend: any, ruleName: string) => {
    const ruleset: any = Array.isArray(extend) ? extend[0] : extend
    Object.keys(ruleset.rules).forEach((key: string) => {
      if (key !== ruleName) {
        delete ruleset.rules[key]
      }
    })
    ruleset?.extends?.forEach((extend: any) => {
      omitRule(extend, rule)
    })
  }

  omitRule(ruleset, rule)
  const linter = useNoopResolver
    ? new Spectral({
        resolver: noopResolver(),
      })
    : new Spectral()

  linter.setRuleset(ruleset)
  return linter
}

function linterForRule(rule: string, useNoopResolver = false): Spectral {
  return buildLinter(
    {
      extends: _.cloneDeep(Object.values(spectralRulesets)),
      rules: {},
    },
    rule,
    useNoopResolver
  )
}

function noopResolver(): Resolver {
  return new Resolver({
    getRef: () => {},
  })
}

export default linterForRule
