import { JsonPath } from "../types"
import { rules } from "../types"
import { MergeStates, OpenApiTypes } from "../types"
import { ArmUtils } from "./utilities/armHelper"
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
     * 2 travel all resources and paths to find all the resources that have a collection get
     */
    const utils = new ArmUtils(doc)
    const allCollectionModels = utils.getCollectionModels()
    const allCollectionApiInfo = utils.getCollectionApiInfo()
    const allResourcesHavingGetOperation = utils.getAllOperationGetResponseModels()
    for (const resource of allCollectionModels.entries()) {
      if (
        allResourcesHavingGetOperation.has(resource[0]) &&
        !allResourcesHavingGetOperation.has(resource[1]) &&
        /**
         * This condition is used to identify this exception:
         * the resource of a collection Api has specific get operation, but the resource does not match the item of the collection model.
         * this exception can be detect by Rule: GetCollectionResponseSchema
         */
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
