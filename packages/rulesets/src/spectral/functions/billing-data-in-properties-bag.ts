// BillingDataInPropertiesBag
// A property named 'BillingData' (matched case-insensitively) must not be defined in a
// resource's properties bag.

import _ from "lodash"
import { getProperties } from "./utils"

const BILLING_DATA = "billingdata" // compared case-insensitively
const PROPERTIES = "properties"
const ERROR_MESSAGE = "The 'BillingData' property is not allowed in the resource properties bag."

// Recursively collect the path to every property named "BillingData" (case-insensitive) that is
// defined within the given schema. Traversal is restricted to schema-structure keywords
// (properties, allOf/anyOf/oneOf, items, additionalProperties) so that only actual property
// definitions are inspected. Values inside non-structural metadata (e.g. default values, enum
// values, examples, or vendor extensions) are intentionally ignored to avoid false positives.
function collectBillingDataPropertyPaths(
  schema: any,
  basePath: (string | number)[],
  matches: (string | number)[][],
  visited: WeakSet<object>
): void {
  if (!_.isObject(schema) || visited.has(schema)) {
    return
  }
  visited.add(schema)

  const s = schema as { [key: string]: any }

  // properties: a map of property name -> property schema
  if (_.isObject(s.properties)) {
    for (const [name, propertySchema] of Object.entries(s.properties as { [key: string]: any })) {
      if (name.toLowerCase() === BILLING_DATA) {
        matches.push([...basePath, PROPERTIES, name])
      }
      collectBillingDataPropertyPaths(propertySchema, [...basePath, PROPERTIES, name], matches, visited)
    }
  }

  // allOf / anyOf / oneOf: arrays of subschemas
  for (const keyword of ["allOf", "anyOf", "oneOf"]) {
    const subschemas = s[keyword]
    if (Array.isArray(subschemas)) {
      subschemas.forEach((subschema: any, index: number) => {
        collectBillingDataPropertyPaths(subschema, [...basePath, keyword, index], matches, visited)
      })
    }
  }

  // items: a single subschema or an array of subschemas
  if (Array.isArray(s.items)) {
    s.items.forEach((itemSchema: any, index: number) => {
      collectBillingDataPropertyPaths(itemSchema, [...basePath, "items", index], matches, visited)
    })
  } else if (_.isObject(s.items)) {
    collectBillingDataPropertyPaths(s.items, [...basePath, "items"], matches, visited)
  }

  // additionalProperties: a subschema (when it is an object rather than a boolean)
  if (_.isObject(s.additionalProperties)) {
    collectBillingDataPropertyPaths(s.additionalProperties, [...basePath, "additionalProperties"], matches, visited)
  }
}

export const billingDataInPropertiesBag = (definition: any, _opts: any, ctx: any) => {
  const bag = getProperties(definition)
  const matches: (string | number)[][] = []
  collectBillingDataPropertyPaths(bag, [], matches, new WeakSet<object>())

  return matches.map((path) => ({
    message: ERROR_MESSAGE,
    path: _.concat(ctx.path, PROPERTIES, path),
  }))
}
