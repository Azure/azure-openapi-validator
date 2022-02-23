export type PatternOption = {
  match?: string
  notMatch?: string
}

export function* pattern(openapiSection: any, ctx?: any) {
  if (typeof openapiSection === "string") {
    const option = ctx.options as PatternOption
    if (option?.match && matchPattern(option.match, openapiSection)) {
      yield {
        location: ctx.location,
        message: "Matched the pattern " + option?.match
      }
    }
    if (option?.notMatch && !matchPattern(option.notMatch, openapiSection)) {
      yield {
        location: ctx.location,
        message: "Not matched the pattern " + option?.notMatch
      }
    }
  }
}

function matchPattern(regStr: string, target: string, ignoreCase?: boolean) {
  return new RegExp(regStr).test(target)
}
