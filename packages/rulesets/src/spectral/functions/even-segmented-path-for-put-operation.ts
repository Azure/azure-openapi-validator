import { createRulesetFunction } from "@stoplight/spectral-core"

// given a path object key for ARM resource in swagger , validate the path is valid.
/**
 * valid paths samples:
 * 1 /<scope>/providers
 * 2 /subscriptionId/{subscriptionID}/providers/{providerName}/resourceType/{resourceTypeName}
 * 3 /subscriptionId/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/{providerName}/resourceType/{resourceTypeName}
 * 4 /subscriptionId/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/{providerName}/{resourceType}/{resourceName}/providers/{providerName}/extensionResourceType/{extensionResourceName}
 *
 */

function matchAnyPatterns(patterns: RegExp[], path: string) {
  return patterns.some((p) => p.test(path))
}
function notMatchPatterns(patterns: RegExp[], path: string) {
  return patterns.every((p) => !p.test(path))
}

function verifyResourceGroup(path: string) {
  const lowerCasePath = path.toLowerCase()
  if (lowerCasePath.includes("/resourcegroups/") && !lowerCasePath.includes("/resourcegroups/{resourcegroupname}")) {
    return false
  }
  return true
}

function verifySubscriptionId(path: string) {
  const lowerCasePath = path.toLowerCase()
  if (lowerCasePath.includes("/subscriptions/") && !lowerCasePath.includes("/subscriptions/{subscriptionid}")) {
    return false
  }
  return true
}

function verifyResourceGroupScope(path: string) {
  // valid patterns:
  // 1 /<scope>/providers/Microsoft.Compute/virtualMachine/{vmName}
  // 2 /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachine/{vmName}
  // 3 /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachine/{vmName}/providers/Microsoft.Billing/extensions/{extensionName}
  const patterns = [
    /^\/subscriptions\/{subscriptionId}\/resourceGroups\/{resourceGroupName}\/providers\/.+/gi,
    /^\/?{\w+}\/resourceGroups\/{resourceGroupName}\/providers\/.+/gi,
    /^\/?{\w+}\/providers\/.+/gi,
  ]
  return matchAnyPatterns(patterns, path)
}
function verifyResourceType(path: string) {
  // invalid paths:
  //  1 <scope>/providers/Microsoft.Compute/{vmName}
  //  2 <scope>/providers/{resourceName}...
  //  3 <scope>/providers/ResourceType/...
  //  4 /providers/Microsoft.Compute/{vmName}
  const patterns = [/^.*\/providers\/\w+\.\w+\/\w+.*/gi]
  return matchAnyPatterns(patterns, path)
}

function verifyNestResourceType(path: string) {
  // invalid patterns:
  //

  const patterns = [
    // 1 <scope>/providers/Microsoft.Compute/virtualMachine/{vmName}/nestedResourceType/actions
    /^.*\/providers\/\w+\.\w+\/\w+\/{\w+}(?:\/\w+\/(?!default)\w+){1,2}$/gi,
    // 2 <scope>/providers/Microsoft.Compute/virtualMachine/{vmName}/nestedTypes/{nestedResourceType}/action1/action2..
    /^.*\/providers\/\w+\.\w+(?:\/\w+\/(default|{\w+})){1,2}(?:\/\w+\/(?!default)\w+)+$/gi,
    // 3 <scope>/providers/Microsoft.Compute/virtualMachine/{vmName}/{nestedResourceType}
    /^.*\/providers\/\w+\.\w+\/\w+\/(?:\/\w+\/(default|{\w+})){0,3}{\w+}(?:\/{\w+})+.*$/gi,
    // 4 <scope>/providers/Microsoft.Compute/virtualMachine/nestedResourceType/{nestedResourceType}
    /^.*\/providers\/\w+\.\w+(?:\/\w+\/(default|{\w+})){0,2}(?:\/\w+\/(?!default)\w+)+\/{\w+}.*$/gi,
  ]
  return notMatchPatterns(patterns, path)
}

export const evenSegmentedPathForPutOperation = (apiPath: any, _opts: any, paths: any) => {
    if (apiPath === null || typeof apiPath !== "string") {
      return []
    }

    const path = paths.path || []
    const errors: any[] = []

    //check if apiPath has even segments
    return errors
}