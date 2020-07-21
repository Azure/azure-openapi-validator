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
    /**
     * 1 get all resources that have point get resource
     * 2 travel all resources and find all the resources that have a collection get
     *   - base on path pattern
     * 3 check the schema with the
     */
    const utils = new ResourceUtils(doc)
    const topLevelResources = utils.getAllTopLevelResources()
    const allCollectionPath = utils.getCollectionApiInfo()
    for (const resource of topLevelResources) {
      const hasMatched = allCollectionPath.some(
        collection => resource === collection.childModelName && utils.isPathByResourceGroup(collection.collectionGetPath)
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
