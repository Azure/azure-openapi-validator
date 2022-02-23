const { migrateRuleset } = require("@stoplight/spectral-ruleset-migrator")
const fs = require("fs")
const path = require("path")

const AsyncFunction = (async () => {}).constructor

export async function getSpectralRuleSet() {
  const m = {}
  const rulesetFile = path.join(__dirname, "spectral.yaml")
  const paths = [path.dirname(rulesetFile), __dirname, ".."]
  await AsyncFunction(
    "module, require",
    await migrateRuleset(rulesetFile, {
      format: "commonjs",
      fs
    })
    // eslint-disable-next-line import/no-dynamic-require,global-require
  )(m, text => require(require.resolve(text, { paths })))
  const ruleset = (m as any).exports
  return ruleset
}
