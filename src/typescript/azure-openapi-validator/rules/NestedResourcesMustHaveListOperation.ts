import { JsonPath } from "../../jsonrpc/types"
import { rules } from "../rule"
import { MergeStates, OpenApiTypes } from "../rule"
import { ResourceUtils } from "./utilities/resourceUtils"

export const NestedResourcesMustHaveListOperation: string = "NestedResourcesMustHaveListOperation "

rules.push({
  id: "R4015",
  name: NestedResourcesMustHaveListOperation,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm,

  *run(doc, node, path) {
    const msg: string = 'The nested resource "{0}" does not have list operation, please add it.'
    /**
     * 1 get all nested resources that have point get resource
     * 2 travel all resources by searching in all get/put operations and find all the resources that have a collection get
     */
    const utils = new ResourceUtils(doc)
    const nestedResource = utils.getAllNestedResources()
    const allCollectionPath = utils.getCollectionApiInfo()
    for (const resource of nestedResource) {
      const hasMatched = allCollectionPath.some(collection => resource === collection.childModelName)
      if (!hasMatched) {
        yield {
          message: msg.replace("{0}", resource),
          location: ["$", "definitions", resource] as JsonPath
        }
      }
    }
  }
})
