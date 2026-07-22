// ReservedNamesInPropertiesBag
// Property names that are reserved (matched case-insensitively) must not be defined in a
// resource's properties bag.

import _ from "lodash"
import { getProperties } from "./utils"

const PROPERTIES = "properties"

// Property names that are reserved and must not appear in a resource's properties bag.
// Matching is case-insensitive. Add new reserved names to this array as they are identified.
const RESERVED_PROPERTY_NAMES = ["BillingData"]

const reservedNameLookup = new Set(RESERVED_PROPERTY_NAMES.map((name) => name.toLowerCase()))

const errorMessage = (name: string) => `Reserved property name '${name}' is not allowed in the resource properties bag.`

// Recursively collect the path to every property whose name is reserved (case-insensitive) and is
// defined within the given schema. Traversal is restricted to schema-structure keywords
// (properties, allOf/anyOf/oneOf, items, additionalProperties) so that only actual property
// definitions are inspected. Values inside non-structural metadata (e.g. default values, enum
// values, examples, or vendor extensions) are intentionally ignored to avoid false positives.
function collectReservedNamePaths(
  schema: any,
  basePath: (string | number)[],
  matches: { path: (string | number)[]; name: string }[],
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
      if (reservedNameLookup.has(name.toLowerCase())) {
        matches.push({ path: [...basePath, PROPERTIES, name], name })
      }
      collectReservedNamePaths(propertySchema, [...basePath, PROPERTIES, name], matches, visited)
    }
  }

  // allOf / anyOf / oneOf: arrays of subschemas
  for (const keyword of ["allOf", "anyOf", "oneOf"]) {
    const subschemas = s[keyword]
    if (Array.isArray(subschemas)) {
      subschemas.forEach((subschema: any, index: number) => {
        collectReservedNamePaths(subschema, [...basePath, keyword, index], matches, visited)
      })
    }
  }

  // items: a single subschema or an array of subschemas
  if (Array.isArray(s.items)) {
    s.items.forEach((itemSchema: any, index: number) => {
      collectReservedNamePaths(itemSchema, [...basePath, "items", index], matches, visited)
    })
  } else if (_.isObject(s.items)) {
    collectReservedNamePaths(s.items, [...basePath, "items"], matches, visited)
  }

  // additionalProperties: a subschema (when it is an object rather than a boolean)
  if (_.isObject(s.additionalProperties)) {
    collectReservedNamePaths(s.additionalProperties, [...basePath, "additionalProperties"], matches, visited)
  }
}

export const reservedNamesInPropertiesBag = (definition: any, _opts: any, ctx: any) => {
  const bag = getProperties(definition)
  const matches: { path: (string | number)[]; name: string }[] = []
  collectReservedNamePaths(bag, [], matches, new WeakSet<object>())

  return matches.map((match) => ({
    message: errorMessage(match.name),
    path: _.concat(ctx.path, PROPERTIES, match.path),
  }))
}
