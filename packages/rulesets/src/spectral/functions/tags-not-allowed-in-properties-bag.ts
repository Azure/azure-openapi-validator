import _ from "lodash"
import { deepFindObjectKeyPath, getProperties } from "./utils"

const TAGS = "tags"
const PROPERTIES = "properties"
const NestedPROPERTIES = "properties"
const ERROR_MESSAGE = "Tags should not be specified in the properties bag for proxy resources. Consider using a Tracked resource instead."

export const tagsNotAllowedInPropertiesBag = (definition: any, _opts: any, ctx: any) => {
  const properties = getProperties(definition)
  const errors = []

  if ("tags" in properties && !("location" in properties)) {
    errors.push({
      message: ERROR_MESSAGE,
      path: _.concat(ctx.path, PROPERTIES, TAGS),
    })
  }

  const deepPropertiesTags = deepFindObjectKeyPath(definition.properties.properties, TAGS)
  if (deepPropertiesTags.length > 0) {
    errors.push({
      message: ERROR_MESSAGE,
      path: _.concat(ctx.path, PROPERTIES, NestedPROPERTIES, deepPropertiesTags[0]),
    })
  }

  return errors
}
