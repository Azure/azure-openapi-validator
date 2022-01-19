import { JsonPath } from "../types"
import { RuleContext, ValidationMessage } from "../rule"

export function* pattern(openapiDocument: any, openapiSection: any, location: JsonPath, ctx?: RuleContext) {
  yield {
    location: location,
    message: "test"
  }
}
