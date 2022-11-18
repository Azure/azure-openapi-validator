import { JsonPath, rules, MergeStates, OpenApiTypes } from "@microsoft.azure/openapi-validator-core"

import { ArmHelper } from "../utilities/arm-helper"
import { isLikeTenantResourcePath } from "../utilities/rules-helper"
export const TopLevelResourcesListBySubscription = "TopLevelResourcesListBySubscription"

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
    const topLevelResources = utils.getTopLevelResources().filter((re) => !re.operations.some((op) => isLikeTenantResourcePath(op.apiPath)))
    const allCollectionApis = utils.getCollectionApiInfo()
    for (const resource of topLevelResources) {
      const hasMatched = allCollectionApis.some(
        (collection) =>
          resource.modelName === collection.childModelName && collection.collectionGetPath.some((p) => utils.isPathBySubscription(p))
      )
      if (!hasMatched) {
        yield {
          message: msg.replace("{0}", resource.modelName),
          location: ["$", "definitions", resource] as JsonPath,
        }
      }
    }
  },
})
