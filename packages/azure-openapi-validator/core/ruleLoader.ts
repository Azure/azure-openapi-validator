import { ruleSet as legacyRuleSet } from "./rulesets/legacy"
import { ruleSet as sdkRuleSet } from "./rulesets/sdk"
import { IRuleSet } from "./types"
const fs = require("fs")
const path = require("path")
export interface IRuleLoader {
  getRuleSet: (rulesetPath?: string) => IRuleSet | Promise<IRuleSet>
}

export class BuiltInRuleLoader {
  getRuleSet(): IRuleSet {
    return {
      documentationUrl: "",
      rules: {
        ...legacyRuleSet.rules,
        ...sdkRuleSet.rules
      }
    }
  }
}