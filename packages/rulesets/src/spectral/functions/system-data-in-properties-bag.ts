// SystemDataInPropertiesBag
// Ensure systemData is not in the properties bag
// RPC Code: RPC-SystemData-V1-01 and RPC-SystemData-V1-02

import _ from "lodash"
import { deepFindObjectKeyPath, getProperties } from "./utils"

const SYSTEM_DATA_CAMEL = "systemData"
const SYSTEM_DATA_UPPER_CAMEL = "SystemData"
const PROPERTIES = "properties"
const ERROR_MESSAGE = "System data must be defined as a top-level property, not in the properties bag."

export const systemDataInPropertiesBag = (definition: any, _opts: any, ctx: any) => {
  const properties = getProperties(definition)
  const path = deepFindObjectKeyPath(properties, SYSTEM_DATA_CAMEL)

  if (path.length > 0) {
    return [
      {
        message: ERROR_MESSAGE,
        path: _.concat(ctx.path, PROPERTIES, path[0]),
      },
    ]
  }

  const pathForUpperCamelCase = deepFindObjectKeyPath(properties, SYSTEM_DATA_UPPER_CAMEL)

  if (pathForUpperCamelCase.length > 0) {
    return [
      {
        message: ERROR_MESSAGE,
        path: _.concat(ctx.path, PROPERTIES, pathForUpperCamelCase[0]),
      },
    ]
  }
  return []
}
