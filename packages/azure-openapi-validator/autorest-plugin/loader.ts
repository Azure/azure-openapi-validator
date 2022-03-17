// @ts-nocheck
import { IRuleSet } from "@microsoft.azure/openapi-validator-core"
import { rulesets } from "@microsoft.azure/openapi-validator-rulesets"
import { Ruleset, RulesetDefinition } from "@stoplight/spectral-core"
import { createRequire } from "module"
import { isObject } from "util"
import { fetch } from '@stoplight/spectral-runtime';
import { bundleRuleset } from '@stoplight/spectral-ruleset-bundler';
import { node } from '@stoplight/spectral-ruleset-bundler/presets/node';
import { builtins } from '@stoplight/spectral-ruleset-bundler/plugins/builtins';
import commonjs from '@rollup/plugin-commonjs';
import {dirname} from "path"
const fs = require("fs")

function load(source: string, uri: string): RulesetDefinition {
  const actualUri = uri;
  // we could use plain `require`, but this approach has a number of benefits:
  // - it is bundler-friendly
  // - ESM compliant
  // - and we have no warning raised by pkg.
  const req = createRequire(actualUri);
  const m: { exports?: RulesetDefinition } = {};
  const paths = [dirname(uri), __dirname];

  const _require = (id: string): unknown => req(req.resolve(id, { paths }));

  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  Function('module, require', source)(m, _require);

  if (!isObject(m.exports)) {
    throw new Error('No valid export found');
  }

  return m.exports;
}

export async function getRuleSet(rulesetFile:string) {
 const ruleset = require(rulesetFile)
 return new Ruleset(ruleset,{severity:"recommended",source:rulesetFile})
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

export function getNativeRuleSet() {
  const mergedRuleset = mergeRulesets(Object.values(rulesets.native))
}
