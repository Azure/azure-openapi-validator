// given a path object key for ARM resource in swagger , validate the path is valid.

function verifyResourceGroup(path: string) {
  const lowerCasePath = path.toLowerCase()
  if (lowerCasePath.includes("/resourcegroups/") && lowerCasePath.includes("/resourcegroups/{resourcegroupsname}")) {
    return false
  }
  return true
}

function verifySubscriptionId(path: string) {
  const lowerCasePath = path.toLowerCase()
  if (lowerCasePath.includes("/subscriptions/") && lowerCasePath.includes("/subscriptions/{subscriptionid}")) {
    return false
  }
  return true
}

function verifyResourceType(path: string) {
  // invalid paths:
  //  1 <scope>/providers/Microsoft.Compute/{vmName}
  //  2 <scope>/providers/{resourceName}/Microsoft.MyNs...
  //  3 <scope>/providers/ResourceType/Microsoft.MyNs...
  const patterns = [/.+\/providers\/[^\/]+\/{[^\/]+}.+/gi, /.+\/providers\/{[^\/]+}\/.+/gi, /.+\/providers\/\w+\/.+/gi]
  if (patterns.some((p) => p.test(path))) {
    return false
  }
  return true
}

/**
 *
 * @param pathKey path key for ARM resource in swagger
 * @param _opts object containing options for the rule: {
 *    segmentToCheck: "resourceType"| "resourceGroups"| "subscriptionId"
 * }
 * @param paths
 * @returns
 */

export const verifyArmPath = (pathKey: any, _opts: any, paths: any) => {
  if (pathKey === null || typeof pathKey !== "string") {
    return []
  }

  const validSegments = ["resourceType", "resourceGroups", "subscriptionId"]
  if (!_opts || !_opts.segmentToCheck || !validSegments.includes(_opts.segmentToCheck)) {
    return []
  }
  const path = paths.path || []

  /**
   * 1 /<scope>/providers
   * 2 /subscriptionId/{subscriptionID}/providers/{providerName}
   * 3 /subscriptionId/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/{providerName}
   * 4 /subscriptionId/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/{providerName}/{resourceType}/{resourceName}/providers/{providerName}/extensionResourceType/{extensionResourceName}
   *
   */
  const errors = []
  if (_opts.segmentToCheck === "resourceType") {
    if (!verifyResourceType(pathKey)) {
      errors.push({
        message: "The URI for the CURD methods do not contain a resource type.",
        path: [...path],
      })
    }
  }
  if (_opts.segmentToCheck === "resourceGroups") {
    if (!verifyResourceGroup(pathKey)) {
      errors.push({
        message: "The URI for resource group scoped CRUD methods does not contain a resourceGroupName parameter.",
        path: [...path],
      })
    }
  }

  if (_opts.segmentToCheck === "subscriptionId") {
    if (!verifySubscriptionId(pathKey)) {
      errors.push({
        message: "The URI for the subscriptions scoped CRUD methods do not contain the subscriptionId parameter.",
        path: [...path],
      })
    }
  }

  return errors
}

export default verifyArmPath
