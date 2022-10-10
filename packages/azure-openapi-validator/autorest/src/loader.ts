import { IRuleSet, OpenApiTypes } from "@microsoft.azure/openapi-validator-core"
import { spectralRulesets } from "@microsoft.azure/openapi-validator-rulesets"
import { Ruleset } from "@stoplight/spectral-core"

export async function getRuleSet(openapiType:OpenApiTypes) {
  let ruleset 
  switch(openapiType) {
    case OpenApiTypes.arm :{
      ruleset = spectralRulesets.azARM
      break;
    }
    case OpenApiTypes.dataplane:{
      ruleset = spectralRulesets.azDataplane
      break;
    }
    default: {
      ruleset = spectralRulesets.azCommon
    }
  }

 return new Ruleset(ruleset,{severity:"recommended"})
 /*const ruleset = await bundleRuleset(rulesetFile, {
        target: 'node',
        format: 'commonjs',
        plugins: [builtins(), commonjs(), ...node({ fs, fetch })],
      });
  return  new Ruleset(load(ruleset,rulesetFile), {
    severity: 'recommended',
    source: rulesetFile,
  }); */
}
  
export const mergeRulesets = (rulesets:IRuleSet[]):IRuleSet=> {
  let rules = {}
  rulesets.forEach((set)=> {
    rules = {
      ...rules,
      ...set.rules
    }
  })
  const mergedRuleSet: IRuleSet = {
    documentationUrl: "",
    rules
  } 
  return mergedRuleSet
}