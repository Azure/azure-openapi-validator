const { migrateRuleset } = require("@stoplight/spectral-ruleset-migrator")
const fs = require("fs")
const path = require("path")

function requireSpectralRules(file) {
  const spectral = require(file)
  return spectral
}
export async function getRuleSet() {
    const ruleSetPath = path.resolve(__dirname,"../..","rulesets","spectral")
    const ruleSetYaml = path.resolve(ruleSetPath, "arm.yaml")
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
