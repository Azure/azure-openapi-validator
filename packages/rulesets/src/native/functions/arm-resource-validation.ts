import { RuleContext } from "@microsoft.azure/openapi-validator-core"
import { ArmHelper } from "../utilities/arm-helper"

export function* trackedResourceMustHavePut(openapiSection: any, options: {}, ctx: RuleContext) {
  const armHelper = new ArmHelper(ctx?.document, ctx?.specPath, ctx?.inventory!)
  const allTrackedResources = armHelper.getTrackedResources()
  for (const re of allTrackedResources) {
    if (!re.operations.some((op) => op.httpMethod === "put")) {
      yield {
        location: ["paths", re.operations.find((op) => op.apiPath)!.apiPath],
        message: `The tracked resource ${re.modelName} does not define the put operation.`,
      }
    }
  }
}
