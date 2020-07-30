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
    const utils = new ResourceUtils(doc)
    const allResources = utils.getAllResources()
    const postOnlyResources = utils.getPostOnlyModels()
    const allResourcesHavingGetOperation = utils.getAllOperationGetResponseModels()
    for (const resource of allResources) {
      if (!allResourcesHavingGetOperation.has(resource) && !utils.containsDiscriminator(resource) && !postOnlyResources.has(resource)) {
        yield {
          message: msg.replace("{0}", resource),
          location: ["$", "definitions", resource] as JsonPath
        }
      }
    }
  }
})
