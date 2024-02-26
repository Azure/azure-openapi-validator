import { Ruleset } from "@stoplight/spectral-core"

/**
 * This type describes the type of values of properties of the spectralRulesets const.
 */
export type SpectralRulesetPayload = {
  rules: { [ruleName: string]: any }
  extends?: SpectralRulesetPayload[]
}

export function getNamesOfRulesInPayloadWithPropertySetToTrue(rulesetPayload: SpectralRulesetPayload, propName: string): string[] {
  const ruleNames: string[] = getNamesOfRulesWithPropertySetToTrue(rulesetPayload.rules, propName)
  if (rulesetPayload.extends && rulesetPayload.extends.length > 0) {
    rulesetPayload.extends.forEach((extendedRulesetPayload) => {
      ruleNames.push(...getNamesOfRulesInPayloadWithPropertySetToTrue(extendedRulesetPayload, propName))
    })
  }
  return ruleNames
}

/**
 * Given input map of rules of form "ruleName -> rule", this function return the ruleName of each rule that has rule.[propName] === true.
 * - Deletes the
 * - If the rule has
 * @param rules
 * @returns
 */
function getNamesOfRulesWithPropertySetToTrue(rules: { [ruleName: string]: any }, propName: string): string[] {
  const rulesByName: [string, any][] = Object.entries(rules)
  const filteredRules: [string, any][] = rulesByName.filter(([_, rule]) => rule?.[propName] === true)
  const namesOfRules: string[] = filteredRules.map(([name, _]) => name)
  return namesOfRules
}

/**
 * The input rulesetPayload is expected to be passed downstream as an argument
 * to stoplight/spectral-core Ruleset constructor which has strict validation on
 * which properties are allowed. This function deletes all known properties
 * that are not allowed by the constructor, thus making the resulting payload
 * conform to the constructor's requirements.
 */
export function deleteRulesPropertiesInPayloadNotValidForSpectralRules(rulesetPayload: SpectralRulesetPayload): void {
  deleteRulesPropertiesNotValidForSpectralRules(rulesetPayload.rules)
  if (rulesetPayload.extends && rulesetPayload.extends.length > 0) {
    rulesetPayload.extends.forEach((extendedRulesetPayload) => {
      deleteRulesPropertiesInPayloadNotValidForSpectralRules(extendedRulesetPayload)
    })
  }
}

function deleteRulesPropertiesNotValidForSpectralRules(rules: { [s: string]: any }): void {
  Object.values(rules).forEach((rule: any) => {
    delete rule.stagingOnly
    delete rule.rpcGuidelineCode
    delete rule.disableForTypeSpec
    delete rule.disableForTypeSpecReason
  })
}

export function disableRulesInRuleset(ruleset: Ruleset, namesOfRulesToDisable: string[]) {
  Object.values(ruleset.rules).forEach((rule) => {
    if (namesOfRulesToDisable.some((name) => rule.name == name)) {
      // This assignment will invoke the setter defined here:
      // https://github.com/stoplightio/spectral/blob/44c40e2b7c9ea6222054da8700049b0307cc5f8b/packages/core/src/ruleset/rule.ts#L121
      // Resulting in value of -1, as defined here:
      // https://github.com/stoplightio/spectral/blob/44c40e2b7c9ea6222054da8700049b0307cc5f8b/packages/ruleset-migrator/src/transformers/rules.ts#L39
      // Note: given we also set here 'rule.enabled = false', setting the severity to 'off' probably is a no-op,
      // but we currently read severity in printRuleNames() function.
      rule.severity = "off"
      // We must disable the rule to ensure it is not run at all. Spectral source for that is in [1].
      // Otherwise, if it throws due to a bug in rule implementation, it will result in fatal error.
      // Example of how a rule can thrown is given in [2].
      // Example where we disable a rule from running in production so it doesn't throw is given in [3].
      // Without this line, the fix in [3] doesn't help. For a proof of that, see [4] and its log, [5],
      // showing that a rule that is supposed to run in stagingOnly, still throws in production.
      // [1] https://github.com/stoplightio/spectral/blob/6d0991572f185ce5cf4031dc1d8eb4035b5eaf1d/packages/core/src/runner/runner.ts#L39
      // [2] https://github.com/Azure/azure-openapi-validator/pull/595
      // [3] https://github.com/Azure/azure-openapi-validator/pull/596
      // [4] https://github.com/Azure/azure-rest-api-specs/pull/26024
      // [5] https://dev.azure.com/azure-sdk/internal/_build/results?buildId=3125612&view=logs&j=0574a2a6-2d0a-5ec6-40e4-4c6e2f70bea2&t=80c3e782-49f0-5d1c-70dd-cbee57bdd0c7&l=252
      rule.enabled = false
    }
  })
}
