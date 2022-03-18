import { join } from "path"
import {default as nativeArm} from "./native/rulesets/arm"
import {default as nativeCommon} from "./native/rulesets/legacy"

function getRuleSetFile(filename:string) {
  return  join (__dirname ,"output", filename +'.js')
}
export const spectralCommonFile = ()=> getRuleSetFile("common")
export const spectralArmFile = ()=> getRuleSetFile("arm")
export const spectralRulesets = {
  spectralCommonFile,
  spectralArmFile,
}
export const nativeRulesets = {
  common:nativeCommon,
  arm: nativeArm,
}
