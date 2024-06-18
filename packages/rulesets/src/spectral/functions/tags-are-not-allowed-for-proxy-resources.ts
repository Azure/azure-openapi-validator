import _ from "lodash"
import { deepFindObjectKeyPath, getProperties } from "./utils"

const TAGS = "tags"
const PROPERTIES = "properties"
const NestedPROPERTIES = "properties"
const ERROR_MESSAGE = "Tags should not be specified in the properties bag for proxy resources. Consider using a Tracked resource instead."

export const tagsAreNotAllowedForProxyResources = (definition: any, _opts: any, ctx: any) => {
  const properties = getProperties(definition)
  const errors = []

  if ("tags" in properties && !("location" in properties)) {
    errors.push({
      message: ERROR_MESSAGE,
      path: _.concat(ctx.path, PROPERTIES, TAGS),
    })
  }

  const deepProperties = deepFindObjectKeyPath(definition.properties.properties, TAGS)
  if (deepProperties.length > 0) {
    errors.push({
      message: ERROR_MESSAGE,
      path: _.concat(ctx.path, PROPERTIES, NestedPROPERTIES, deepProperties[0]),
    })
  }

  return errors
}
