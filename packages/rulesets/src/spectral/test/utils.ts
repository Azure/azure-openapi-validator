import { Spectral } from '@stoplight/spectral-core';
import {spectralRulesets} from "../../index"

export  function buildLinter(ruleset:any,rule:string) {

  const omitRule= (ruleset:any,ruleName:string) => {
    Object.keys(ruleset.rules).forEach((key:string) => {
      if (key !== ruleName) {
        delete ruleset.rules[key];
      }
    });
    ruleset?.extends?.forEach((extend:any) => {
       omitRule(extend,rule)
    }) 
  }

  omitRule(ruleset,rule)
  const linter = new Spectral();
  linter.setRuleset(ruleset);
  return linter;
  
}

function linterForRule(rule:string):Spectral {
  return buildLinter({
    extends: Object.values(spectralRulesets),
    rules:{}
  } ,rule)
}

export default linterForRule

