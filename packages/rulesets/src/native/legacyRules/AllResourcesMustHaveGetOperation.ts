import { JsonPath, rules, MergeStates, OpenApiTypes } from "@microsoft.azure/openapi-validator-core"

import { ArmHelper } from "../utilities/arm-helper"
export const AllResourcesMustHaveGetOperation = "AllResourcesMustHaveGetOperation"

rules.push({
  id: "R4014",
  name: AllResourcesMustHaveGetOperation,
  severity: "warning",
  category: "ARMViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$",
  *run(doc, node, path, ctx) {
    const msg = 'The resource "{0}" does not have get operation, please add it.'
    /**
     * 1 get all collection models
     * 2 travel all resources and paths to find all the resources that have a collection get
     */
    const utils = new ArmHelper(doc, ctx?.specPath!, ctx?.inventory!)
    const allResources = utils.resourcesWithPutPatchOperations()
    const allResourcesHavingGetOperation = utils.getAllResourceNames()
    for (const resource of allResources) {
      if (!allResourcesHavingGetOperation.includes(resource.modelName)) {
        yield {
          message: msg.replace("{0}", resource.modelName),
          location: ["$", "definitions", resource.modelName] as JsonPath,
        }
      }
    }
  },
})
