// Check a sku model to ensure it must have a name property. It can also have 'tier', 'size', 'family', 'capacity' as optional properties.

import { RulesetFunctionContext } from "@stoplight/spectral-core";
import { getProviderNamespace, getProviderNamespaceFromPath } from "./utils";

const providerNamespace:any = (apiPath:any, opts:any, ctx:RulesetFunctionContext) => {
  if (apiPath === null || typeof apiPath !== 'string') {
    return [];
  }

  const path = ctx.path || [];
  const errors = []
  
  const nameSpaceFromApiPath = getProviderNamespace(apiPath)
  const nameSpaceFromFromFilePath = getProviderNamespaceFromPath(ctx.document.source!)
  if (nameSpaceFromApiPath && nameSpaceFromFromFilePath && nameSpaceFromApiPath !== nameSpaceFromFromFilePath) {
    errors.push({
      error:`The last resource provider '${nameSpaceFromApiPath}' doesn't match the namespace.`,
      path
    })
  }
  return errors;
};

export default providerNamespace