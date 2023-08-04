import { getProperties } from "./utils"

// Check that the body parameter for put operation includes a top level property for tags when its a tracked resource and that it is specified as an optional property.
// The code assumes it is running on a resolved doc
function matchAnyPatterns(patterns: RegExp[], path: string) {
  return patterns.some((p) => p.test(path))
}
function notMatchPatterns(invalidPatterns: RegExp[], path: string) {
  return invalidPatterns.every((p) => !p.test(path))
}
function verifyResourceGroupScope(path: string) {
  // valid patterns:
  // 1 /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachine/{vmName}
  // 2 /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachine/{vmName}/providers/Microsoft.Billing/extensions/{extensionName}
  const patterns = [
    /^\/subscriptions\/{subscriptionId}\/resourceGroups\/{resourceGroupName}\/providers\/.+/gi,
    /^\/subscriptions\/{subscriptionId}\/resourceGroups\/{resourceGroupName}\/providers\/\w+\.\w+\/\w+.*/gi,
  ]
  return matchAnyPatterns(patterns, path)
}

function verifyNestResourceGroupScope(path: string) {
  const invalidPatterns = [
    // 1 <scope>/providers/Microsoft.Compute/virtualMachine/{vmName}/nestedResourceType/actions
    /^\/subscriptions\/{subscriptionId}\/resourceGroups\/{resourceGroupName}\/providers\/\w+\.\w+\/\w+\/{\w+}(?:\/\w+\/(?!default)\w+){1,2}$/gi,
    // 2 <scope>/providers/Microsoft.Compute/virtualMachine/{vmName}/nestedTypes/{nestedResourceType}/action1/action2..
    /^\/subscriptions\/{subscriptionId}\/resourceGroups\/{resourceGroupName}\/providers\/\w+\.\w+(?:\/\w+\/(default|{\w+})){1,2}(?:\/\w+\/(?!default)\w+)+$/gi,
    // 3 <scope>/providers/Microsoft.Compute/virtualMachine/{vmName}/{nestedResourceType}
    /^\/subscriptions\/{subscriptionId}\/resourceGroups\/{resourceGroupName}\/providers\/\w+\.\w+\/\w+\/(?:\/\w+\/(default|{\w+})){0,3}{\w+}(?:\/{\w+})+.*$/gi,
    // 4 <scope>/providers/Microsoft.Compute/virtualMachine/nestedResourceType/{nestedResourceType}
    /^\/subscriptions\/{subscriptionId}\/resourceGroups\/{resourceGroupName}\/providers\/\w+\.\w+(?:\/\w+\/(default|{\w+})){0,2}(?:\/\w+\/(?!default)\w+)+\/{\w+}.*$/gi,
  ]
  return notMatchPatterns(invalidPatterns, path)
}

const pathForTrackedResourceTypes = (pathItem: any, _opts: any, paths: any) => {
  if (pathItem === null || typeof pathItem !== "object") {
    return []
  }
  const path = paths.path || []

  const errors: any[] = []

  const pathParams = pathItem.parameters || []

  if (pathItem["put"] && Array.isArray(pathItem["put"].parameters)) {
    const allParams = [...pathParams, ...pathItem["put"].parameters]
    const bodyParam = allParams.find((p: any) => p.in === "body")
    if (bodyParam) {
      const properties = getProperties(bodyParam.schema)
      if ("location" in properties) {
        if (!verifyResourceGroupScope(path[1]) || !verifyNestResourceGroupScope(path[1])) {
          errors.push({
            message: "The path must be under a subscription and resource group for tracked resource types.",
            path,
          })
        }
      }
    }
  }

  return errors
}

export default pathForTrackedResourceTypes
