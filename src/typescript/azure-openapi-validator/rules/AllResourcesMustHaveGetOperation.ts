import { JsonPath } from "../../jsonrpc/types"
import { rules } from "../rule"
import { MergeStates, OpenApiTypes } from "../rule"
import { ResourceUtils } from "./utilities/resourceUtils"
export const AllResourcesMustHaveGetOperation: string = "AllResourcesMustHaveGetOperation"

rules.push({
  id: "R4014",
  name: AllResourcesMustHaveGetOperation,
  severity: "warning",
  category: "ARMViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$",
  *run(doc, node, path) {
    const msg: string = 'The resource "{0}" does not have get operation, please add it.'
    /**
     * 1 get all resources that have point get resource
     * 2 travel all resources and find all the resources that have a collection get
     *   - base on path pattern
     * 3 check the schema with the
     */
    const utils = new ResourceUtils(doc)
    const allResources = utils.getAllResources()
    const allResourcesHavingGetOperation = utils.getAllOperationGetResponseModels()
    for (const resource of allResources) {
      if (!allResourcesHavingGetOperation.has(resource) && !utils.containsDiscriminator(resource)) {
        yield {
          message: msg.replace("{0}", resource),
          location: ["$", "definitions", resource] as JsonPath
        }
      }
    }
  }
})
