import { JsonPath } from "../types"
import { rules } from "../rule"
import { MergeStates, OpenApiTypes } from "../rule"
import { ArmUtils } from "./utilities/ArmUtils"
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
    const utils = new ArmUtils(doc)
    const topLevelResources = utils.getTopLevelResourcesByRG()
    const allCollectionApis = utils.getCollectionApiInfo()
    for (const resource of topLevelResources) {
      const hasMatched = allCollectionApis.some(
        collection => resource === collection.childModelName && collection.collectionGetPath.some(p => utils.isPathByResourceGroup(p))
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
