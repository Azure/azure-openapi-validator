// Check a sku model to ensure it must have a name property. It can also have 'tier', 'size', 'family', 'capacity' as optional properties.

import { RuleContext } from "@microsoft.azure/openapi-validator-core"
import { getProviderNamespace, getProviderNamespaceFromPath } from "../utilities/rules-helper"

export function* providerNamespace(apiPath: any, options: {}, ctx: RuleContext) {
  if (apiPath && apiPath !== "string") {
    const path = ctx.location || []
    const nameSpaceFromApiPath = getProviderNamespace(apiPath)
    const nameSpaceFromFromFilePath = getProviderNamespaceFromPath(ctx.specPath)
    if (nameSpaceFromApiPath && nameSpaceFromFromFilePath && nameSpaceFromApiPath !== nameSpaceFromFromFilePath) {
      yield {
        message: `The last resource provider '${nameSpaceFromApiPath}' doesn't match the namespace.`,
        location: path,
      }
    }
  }
}
