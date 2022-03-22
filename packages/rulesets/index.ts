import { join } from "path"
import {default as nativeArm} from "./native/rulesets/arm"
import {default as nativeCommon} from "./native/rulesets/legacy"
import {default as spectralArmRuleset} from "./spectral/arm"
import {default as spectralCommonRuleset} from "./spectral/common"

function getRuleSetFile(filename:string) {
  return  join (__dirname ,"spectral", filename +'.js')
}
export const spectralCommonRulesetFile = ()=> getRuleSetFile("common")
export const spectralArmRulesetFile = ()=> getRuleSetFile("arm")

export const spectralRulesets = {
  spectralCommonRulesetFile,
  spectralArmRulesetFile,
  spectralArmRuleset,
  spectralCommonRuleset
}
export const nativeRulesets = {
  common:nativeCommon,
  arm: nativeArm,
}
