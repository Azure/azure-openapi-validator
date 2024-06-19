import { isNull } from "lodash"

const xmsPageableForListCalls = (swaggerObj: any, _opts: any, paths: any) => {
  if (swaggerObj === null) {
    return []
  }
  const path = paths.path || []
  if (!isNull(path[1])) {
    if (verifyResourceGroupScope(paths.path[1])) {
      return
    }
  }
  if (swaggerObj["x-ms-pageable"]) return []
  else
    return [
      {
        message: "`x-ms-pageable` extension must be specified for LIST APIs.",
        path: path,
      },
    ]
}

export default xmsPageableForListCalls

function matchAnyPatterns(patterns: RegExp[], path: string) {
  return patterns.some((p) => p.test(path))
}

function verifyResourceGroupScope(path: string) {
  // valid patterns:
  // 1 /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachine/{vmName}
  // 2 /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachine/{vmName}/providers/Microsoft.Billing/extensions/{extensionName}
  const patterns = [
    /^\/subscriptions\/{\w+}\/resourceGroups\/{\w+}\/providers\/.+/gi,
    /^\/subscriptions\/{\w+}\/resourceGroups\/{\w+}\/providers\/\w+\.\w+\/\w+.*/gi,
  ]
  return matchAnyPatterns(patterns, path)
}
