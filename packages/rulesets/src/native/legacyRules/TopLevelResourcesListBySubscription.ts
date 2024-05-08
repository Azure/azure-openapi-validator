import { JsonPath, rules, MergeStates, OpenApiTypes } from "@microsoft.azure/openapi-validator-core"

import { ArmHelper } from "../utilities/arm-helper"
export const TopLevelResourcesListBySubscription = "TopLevelResourcesListBySubscription"

// RPC Code: RPC-Get-V1-05
rules.push({
  id: "R4017",
  name: TopLevelResourcesListBySubscription,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$",
  *run(doc, node, path, ctx) {
    const msg = 'The top-level resource "{0}" does not have list by subscription operation, please add it.'
    const utils = new ArmHelper(doc, ctx?.specPath!, ctx?.inventory!)
    const topLevelResources = utils.getTopLevelResourceNames()
    const allCollectionApis = utils.getCollectionApiInfo()
    for (const path in node.paths) {
      const hasMatchedTenantLevel = utils.isPathTenantLevel(path)
      if (hasMatchedTenantLevel) {
        return
      }
    }
    for (const resource of topLevelResources) {
      const hasMatched = allCollectionApis.some(
        (collection) => resource === collection.childModelName && collection.collectionGetPath.some((p) => utils.isPathBySubscription(p))
      )
      if (!hasMatched) {
        yield {
          message: msg.replace("{0}", resource),
          location: ["$", "definitions", resource] as JsonPath,
        }
      }
    }
  },
})
