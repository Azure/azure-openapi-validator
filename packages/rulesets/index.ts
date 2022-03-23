import { join } from "path"
import {default as nativeArm} from "./native/rulesets/arm"
import {default as nativeCommon} from "./native/rulesets/legacy"
import {default as spectralArmRuleset} from "./spectral/arm"
import {default as spectralCommonRuleset} from "./spectral/common"

const spectralRulesetDir = join (__dirname,"spectral")
export const spectralCommonRulesetFile = join(spectralRulesetDir, "common.js")
export const spectralArmRulesetFile = join(spectralRulesetDir, "arm.js")

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
