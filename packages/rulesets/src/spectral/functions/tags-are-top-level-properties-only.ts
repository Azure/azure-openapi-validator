import _ from "lodash"
import { deepFindObjectKeyPath, getProperties } from "./utils"

const TAGS = "tags"
const PROPERTIES = "properties"
const ERROR_MESSAGE = "Tags must be defined as a top-level property, not in the properties bag."

export const tagsAreTopLevelPropertiesOnly = (definition: any, _opts: any, ctx: any) => {
  const properties = getProperties(definition)
  const path = deepFindObjectKeyPath(properties, TAGS)

  if (path.length > 0) {
    return [
      {
        message: ERROR_MESSAGE,
        path: _.concat(ctx.path, PROPERTIES, path[0]),
      },
    ]
  }

  return []
}
