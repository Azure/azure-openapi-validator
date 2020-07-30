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
    * 1 get all collection models
    * 2 travel all resources and find all the resources that have a collection get
    *   - base on path pattern
    */
    const utils = new ResourceUtils(doc)
    const allCollectionModels = utils.getCollectionModels()
    const allCollectionApiInfo = utils.getCollectionApiInfo()
    const allResourcesHavingGetOperation = utils.getAllOperationGetResponseModels()
    for (const resource of allCollectionModels.entries()) {
      if (
        allResourcesHavingGetOperation.has(resource[0]) &&
        !allResourcesHavingGetOperation.has(resource[1]) &&
        !allCollectionApiInfo.some(info => info.modelName === resource[0])
      ) {
        yield {
          message: msg.replace("{0}", resource[1]),
          location: ["$", "definitions", resource[1]] as JsonPath
        }
      }
    }
  }
})
