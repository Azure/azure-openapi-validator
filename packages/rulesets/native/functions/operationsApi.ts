import { RuleContext } from "@microsoft.azure/openapi-validator-core"
export type OperationApiOption = {
}

export function* operationApis(openapiSection: any, options: OperationApiOption, ctx?: RuleContext) {
  if (typeof openapiSection === "object") {
    if (!Object.keys(openapiSection).some(op => op.endsWith("operations"))) {
      yield {
        location: ctx?.location || [],
        message: "Missing OperationApi"
      }
    }
   
  }
}
