// given a path object key for ARM resource in swagger , validate the path is valid.
/**
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
  const patterns = [/^.*\/providers\/microsoft\.\w+\/\w+.*/gi]
  return matchAnyPatterns(patterns, path)
}

function verifyNestResourceType(path: string) {
  // invalid patterns:
  // 1 <scope>/providers/Microsoft.Compute/virtualMachine/{vmName}/nestedResourceType/actions
  // 2 <scope>/providers/Microsoft.Compute/virtualMachine/{vmName}/{nestedResourceType}

  const patterns = [
    /^.*\/providers\/microsoft\.\w+\/\w+\/{\w+}(?:\/\w+\/(?!default)\w+){1,2}/gi,
    /^.*\/providers\/microsoft\.\w+(?:\/\w+\/(default|{\w+})){1,2}(?:\/\w+\/(?!default)\w+)+/gi,
    /^.*\/providers\/microsoft\.\w+\/\w+\/{\w+}(?:\/{\w+})+.*/gi,
  ]
  return notMatchPatterns(patterns, path)
}

function verifyScope(path: string) {
  // valid patterns:
  // 1 /<scope>/providers/Microsoft.Compute/virtualMachine/{vmName}
  // 2 /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachine/{vmName}
  // 3 /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachine/{vmName}/providers/Microsoft.Billing/extensions/{extensionName}
  // 4 /subscriptions/{subscriptionId}/providers/Microsoft.Compute/virtualMachine/{vmName}/providers/Microsoft.Billing/extensions/{extensionName}/{extensionName}
  const patterns = [
    /^\/subscriptions\/{subscriptionId}(\/resourceGroups\/{resourceGroupName})?\/providers\/.+/gi,
    /^\/?{\w+}\/providers\/.+/gi,
  ]
  return matchAnyPatterns(patterns, path)
}

/**
 *
 * @param pathKey path key for ARM resource in swagger
 * @param _opts object containing options for the rule: {
 *    segmentToCheck: "scope", "resourceGroupParam", "subscriptionIdParam", "resourceType", "nestedResourceType"
 * }
 * @param paths
 * @returns
 */

export const verifyArmPath = (pathKey: any, _opts: any, paths: any) => {
  if (pathKey === null || typeof pathKey !== "string") {
    return []
  }

  const validOptions = ["scope", "resourceGroupParam", "subscriptionIdParam", "resourceGroupScope", "resourceType", "nestedResourceType"]
  if (
    !_opts ||
    !_opts.segmentToCheck ||
    (typeof _opts.segmentToCheck === "string" && !validOptions.includes(_opts.segmentToCheck)) ||
    (Array.isArray(_opts.segmentToCheck) && !_opts.segmentToCheck.every((s: string) => validOptions.includes(s)))
  ) {
    return []
  }
  const path = paths.path || []

  const errors: any[] = []

  const optionsHandlers = {
    resourceType: (pathKey: string) => {
      if (!verifyResourceType(pathKey)) {
        errors.push({
          message: `The URI for the CURD methods do not contain a resource type.`,
          path: [...path],
        })
      }
    },
    nestedResourceType: (pathKey: string) => {
      if (!verifyNestResourceType(pathKey)) {
        errors.push({
          message: `The URI for nested resource doest not meet the valid resource pattern.`,
          path: [...path],
        })
      }
    },
    resourceGroupParam: (pathKey: string) => {
      if (!verifyResourceGroup(pathKey)) {
        errors.push({
          message: `The URI for resource group scoped CRUD methods does not contain a resourceGroupName parameter.`,
          path: [...path],
        })
      }
    },
    subscriptionIdParam: (pathKey: string) => {
      if (!verifySubscriptionId(pathKey)) {
        errors.push({
          message: `The URI for the subscriptions scoped CRUD methods do not contain the subscriptionId parameter.`,
          path: [...path],
        })
      }
    },
    scope: (pathKey: string) => {
      if (!verifyScope(pathKey)) {
        errors.push({
          message: "",
          path: [...path],
        })
      }
    },
    resourceGroupScope: (pathKey: string) => {
      if (!verifyResourceGroupScope(pathKey)) {
        errors.push({
          message: "",
          path: [...path],
        })
      }
    },
  }
  const segments = typeof _opts.segmentToCheck === "string" ? [_opts.segmentToCheck] : _opts.segmentToCheck
  segments.forEach((segment: string) => {
    optionsHandlers[segment](pathKey)
  })
  return errors
}

export default verifyArmPath
