import { JsonPath } from "../types"
import { RuleContext, ValidationMessage } from "../rule"

export type PatternOption = {
  match?: string
  notMatch?: string
}

export function* pattern(openapiDocument: any, openapiSection: any, location: JsonPath, ctx?: RuleContext, option?: PatternOption) {
  if (typeof openapiSection === "string") {
    if (option?.match && matchPattern(option.match, openapiSection)) {
      yield {
        location: location,
        message: "Matched the pattern " + option?.match
      }
    }
    if (option?.notMatch && !matchPattern(option.notMatch, openapiSection)) {
      yield {
        location: location,
        message: "Not matched the pattern " + option?.match
      }
    }
  }
}

function matchPattern(regStr: string, target: string, ignoreCase?: boolean) {
  return new RegExp(regStr).test(target)
}
