import { JsonPath } from "@microsoft.azure/openapi-validator-core"
import { rules } from "@microsoft.azure/openapi-validator-core"
import { MergeStates, OpenApiTypes } from "@microsoft.azure/openapi-validator-core"
import { ArmHelper } from "../utilities/armHelper"
export const TopLevelResourcesListBySubscription = "TopLevelResourcesListBySubscription"

rules.push({
  id: "R4017",
  name: TopLevelResourcesListBySubscription,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$",
  *run(doc, node, path, ctx) {
    const msg = 'The top-level resource "{0}" does not have list by subscription operation, please add it.'
    const utils = new ArmHelper(doc, ctx?.specPath, ctx?.inventory)
    const topLevelResources = utils.getAllTopLevelResources()
    const allCollectionApis = utils.getCollectionApiInfo()
    for (const resource of topLevelResources) {
      const hasMatched = allCollectionApis.some(
        collection => resource === collection.childModelName && collection.collectionGetPath.some(p => utils.isPathBySubscription(p))
      )
      if (!hasMatched) {
        yield {
          message: msg.replace("{0}", resource),
          location: ["$", "definitions", resource] as JsonPath
        }
      }
    }
  }
})
