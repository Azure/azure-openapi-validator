import { JsonPath } from "../typeDeclaration"
import { RuleContext } from "../rule"

export function* pattern(openapiDocument: any, openapiSection: any, location: JsonPath, ctx?: RuleContext) {
  yield {
    path: location,
    message: "test"
  }
}
