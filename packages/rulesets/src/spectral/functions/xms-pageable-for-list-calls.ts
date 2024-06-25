import { isNull } from "lodash"

const xmsPageableForListCalls = (swaggerObj: any, _opts: any, paths: any) => {
  if (swaggerObj === null) {
    return []
  }
  const path = paths.path || []
  //path array contains 3 values
  // 0 - paths
  // 1 - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Configurations
  // 2 - get
  if (!isNull(path[1])) {
    if (verifyPointGetScope(paths.path[1])) {
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

function verifyPointGetScope(path: string) {
  // valid patterns:
  // 1 */providers/Microsoft.Compute/virtualMachine/vmName
  // 2 */providers/Microsoft.Compute/virtualMachine/vmName/nestedVirtualMachine/nestedvmName
  // 3 */providers/Microsoft.Compute/virtualMachine/vmName/providers/Microsoft.Billing/extensions/extensionName
  const patterns = [
    /^.*\/providers\/\w+\.\w+\/\w+\/\w+.*/gi,
    /^.*\/providers\/\w+\.\w+\/\w+\/\w+\/\w+\/\w+.*/gi,
    /^.*\/providers\/\w+\.\w+\/\w+\/\w+\/providers\/\w+\.\w+\/\w+\/\w+.*/gi,
  ]
  return matchAnyPatterns(patterns, path)
}
