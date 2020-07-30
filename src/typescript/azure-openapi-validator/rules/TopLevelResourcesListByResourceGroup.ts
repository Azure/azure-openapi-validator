import { JsonPath } from "../../jsonrpc/types"
import { rules } from "../rule"
import { MergeStates, OpenApiTypes } from "../rule"
import { ResourceUtils } from "./utilities/resourceUtils"
export const TopLevelResourcesListByResourceGroup: string = "TopLevelResourcesListByResourceGroup"

rules.push({
  id: "R4016",
  name: TopLevelResourcesListByResourceGroup,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$",
  *run(doc, node, path) {
    const msg: string = 'The top-level resource "{0}" does not have list by resource group operation, please add it.'
    const utils = new ResourceUtils(doc)
    const topLevelResources = utils.getAllTopLevelResources()
    const allCollectionPath = utils.getCollectionApiInfo()
    for (const resource of topLevelResources) {
      const hasMatched = allCollectionPath.some(
        collection => resource === collection.childModelName && collection.collectionGetPath.some(p => utils.isPathByResourceGroup(p))
      )
      if (!hasMatched && !utils.hasBrotherResource(resource)) {
        yield {
          message: msg.replace("{0}", resource),
          location: ["$", "definitions", resource] as JsonPath
        }
      }
    }
  }
})
