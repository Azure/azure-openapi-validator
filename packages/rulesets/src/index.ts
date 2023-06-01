import { join } from "path"
import armRuleset from "./native/rulesets/arm"
import commonRuleset from "./native/rulesets/common"
import azARM from "./spectral/az-arm"
import azCommon from "./spectral/az-common"
import azDataplane from "./spectral/az-dataplane"

const spectralRulesetDir = join(__dirname, "spectral")
export const spectralCommonRulesetFile = join(spectralRulesetDir, "az-common.js")
export const spectralArmRulesetFile = join(spectralRulesetDir, "az-arm.js")
export const spectralDataplaneRulesetFile = join(spectralRulesetDir, "az-dataplane.js")

export const spectralRulesets = {
  azARM,
  azCommon,
  azDataplane,
}
export const nativeRulesets = {
  azCommon: commonRuleset,
  azArm: armRuleset,
}
