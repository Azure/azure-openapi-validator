import { JsonPath } from "../../jsonrpc/types"
import { rules } from "../rule"
import { MergeStates, OpenApiTypes } from "../rule"
import { ResourceUtils } from "./utilities/resourceUtils"
export const TopLevelResourcesListBySubscription: string = "TopLevelResourcesListBySubscription"

rules.push({
  id: "R4017",
  name: TopLevelResourcesListBySubscription,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$",
  *run(doc, node, path) {
    const msg: string = 'The top-level resource "{0}" does not have list by subscription operation, please add it.'
    const utils = new ResourceUtils(doc)
    const topLevelResources = utils.getAllTopLevelResources()
    const allCollectionPath = utils.getCollectionApiInfo()
    for (const resource of topLevelResources) {
      const hasMatched = allCollectionPath.some(
        collection => resource === collection.childModelName && collection.collectionGetPath.some(p => utils.isPathBySubscription(p))
      )
      /**
       * here is a exception: if get operation return model1, but put return model2, the model1 and model2 consider as brothers models
       */
      if (!hasMatched && !utils.hasBrotherResource(resource)) {
        yield {
          message: msg.replace("{0}", resource),
          location: ["$", "definitions", resource] as JsonPath
        }
      }
    }
  }
})
