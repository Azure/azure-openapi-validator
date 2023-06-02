// SystemDataInPropertiesBag
// Ensure systemData is not in the properties bag
// RPC Code: RPC-SystemData-V1-01 and RPC-SystemData-V1-02

import _ from "lodash"
import { deepFindObjectKeyPath, getProperties } from "./utils"

const SYSTEM_DATA = "systemData"
const PROPERTIES = "properties"
const ERROR_MESSAGE = "System data must be defined as a top-level property, not in the properties bag."

export const systemDataInPropertiesBag = (definition: any, _opts: any, ctx: any) => {
  const properties = getProperties(definition)
  const path = deepFindObjectKeyPath(properties, SYSTEM_DATA)
  // const pathToTopLevelProperty = _.dropRightWhile(path, (item) => SYSTEM_DATA !== item && PROPERTIES !== item)
  // console.log("ctx path: " + ctx.path)
  // console.log("path: " + path)
  // console.log("pathToTopLevel: " + pathToTopLevelProperty + "\n\n\n")
  if (path.length > 0) {
    return [
      {
        message: ERROR_MESSAGE,
        path: _.concat(ctx.path, PROPERTIES, path),
      },
    ]
  }
  return []
}
