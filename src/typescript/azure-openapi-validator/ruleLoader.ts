import { defaultRuleSet as ruleSet } from "./rulesets/default"
import { IRuleSet } from "./types"
export interface IRuleLoader {
  getRuleSet: (rulesetPath?: string) => IRuleSet
}

export class BuiltInRuleLoader {
  getRuleSet() {
    return ruleSet
  }
}

export class RemoteRuleLoader {}
