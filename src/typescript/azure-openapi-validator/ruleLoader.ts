import { defaultRuleSet as ruleSet } from "./rulesets/default"
import { IRuleSet } from "./types"
export interface IRuleLoader {
  getRuleSet: () => IRuleSet
}

export class RuleLoader {
  getRuleSet() {
    return ruleSet
  }
}
