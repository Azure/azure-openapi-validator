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
    // Top-level resources are calculated by ArmHelper.getTopLevelResources():
    // 1. Scans all operations (GET/PUT/POST/PATCH/DELETE) in paths and x-ms-paths
    // 2. For each operation, checks the 200/201 response schema's $ref to find resource definitions
    // 3. A definition is a "resource" if it has x-ms-azure-resource:true or allOfs Resource/TrackedResource/ProxyResource
    // 4. A resource is "top-level" if its path has exactly ONE resource-type segment after /providers/
    //    e.g., /subscriptions/{sub}/providers/Microsoft.Contoso/widgets/{name} → "widgets" is top-level
    //    vs. /.../widgets/{name}/parts/{partName} → "parts" is nested (2 segments)
    const topLevelResources = utils.getTopLevelResources()
    const allCollectionApis = utils.getCollectionApiInfo()

    // The same model can be discovered multiple times (different operations/files),
    // but we only want to report at most once per definition name.
    const validatedModels = new Set<string>()
    for (const resource of topLevelResources) {
      const resourceName = resource.modelName
      // Skip already validated resources
      if (validatedModels.has(resourceName)) {
        continue
      }

      // Tenant-scoped resources do not need list-by-subscription, so skip them.
      const hasSubscriptionScopedOperation = resource.operations?.some((op: { apiPath: string }) => utils.isPathBySubscription(op.apiPath))
      if (!hasSubscriptionScopedOperation) {
        continue
      }

      validatedModels.add(resourceName)
      const hasMatched = allCollectionApis.some(
        (collection) =>
          resourceName === collection.childModelName && collection.collectionGetPath.some((p) => utils.isPathBySubscription(p)),
      )
      if (!hasMatched) {
        yield {
          message: msg.replace("{0}", resourceName),
          location: ["$", "definitions", resourceName] as JsonPath,
        }
      }
    }
  },
})
