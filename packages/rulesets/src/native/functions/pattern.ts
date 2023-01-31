import { RuleContext } from "@microsoft.azure/openapi-validator-core"
export type PatternOption = {
  match?: string
  notMatch?: string
}

export function* pattern(openapiSection: any, options: PatternOption, ctx?: RuleContext) {
  if (typeof openapiSection === "string") {
    if (options?.match && matchPattern(options.match, openapiSection)) {
      yield {
        location: ctx?.location || [],
        message: "Matched the pattern " + options?.match,
      }
    }
    if (options?.notMatch && !matchPattern(options.notMatch, openapiSection)) {
      yield {
        location: ctx?.location || [],
        message: "Not matched the pattern " + options?.notMatch,
      }
    }
  }
}

function matchPattern(regStr: string, target: string, ignoreCase?: boolean) {
  return new RegExp(regStr).test(target)
}
