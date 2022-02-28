import { ruleSet as legacyRuleSet } from "./rulesets/legacy"
import { ruleSet as sdkRuleSet } from "./rulesets/sdk"
import { IRuleSet } from "./types"
const { migrateRuleset } = require("@stoplight/spectral-ruleset-migrator")
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
function requireSpectralRules(file) {
  const spectral = require(file)
  if (spectral.extends) {
    delete spectral.extends
  }
  return spectral
}
export class SpectralRuleLoader {
  async getRuleSet() {
    const ruleSetPath = path.resolve(__dirname, "rulesets")
    const ruleSetYaml = path.resolve(ruleSetPath, "spectral.yaml")
    const ruleSetJsFile = path.resolve(ruleSetPath, "spectral.js")
    if (fs.existsSync(ruleSetJsFile)) {
      return requireSpectralRules(ruleSetJsFile)
    }
    const rulesetForJS = await migrateRuleset(ruleSetYaml, {
      format: "commonjs",
      fs
    })
    fs.writeFileSync(ruleSetJsFile, rulesetForJS)
    return requireSpectralRules(path.join(ruleSetPath, "spectral.js"))
  }
}
