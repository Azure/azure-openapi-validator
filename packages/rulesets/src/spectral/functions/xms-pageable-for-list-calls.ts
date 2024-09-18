import { isNull } from "lodash"
import { isListOperationPath } from "../../native/utilities/rules-helper"

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
    if (!isListOperationPath(path[1].toString())) {
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
