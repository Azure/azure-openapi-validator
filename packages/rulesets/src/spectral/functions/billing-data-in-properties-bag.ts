// BillingDataInPropertiesBag
// A property named 'BillingData' (matched case-insensitively) must not be present in a
// resource's properties bag.

import _ from "lodash"
import { getProperties } from "./utils"

const BILLING_DATA = "billingdata" // compared case-insensitively
const PROPERTIES = "properties"
const ERROR_MESSAGE = "The 'BillingData' property is not allowed in the resource properties bag."

// Recursively collect the path to every property named "BillingData" (case-insensitive) within
// the given properties bag, descending into all nested objects.
function collectBillingDataPaths(object: any, basePath: (string | number)[], matches: (string | number)[][]): void {
  if (!_.isObject(object)) {
    return
  }
  for (const [key, value] of Object.entries(object)) {
    if (key.toLowerCase() === BILLING_DATA) {
      matches.push([...basePath, key])
    }
    collectBillingDataPaths(value, [...basePath, key], matches)
  }
}

export const billingDataInPropertiesBag = (definition: any, _opts: any, ctx: any) => {
  const properties = getProperties(definition)
  const matches: (string | number)[][] = []
  collectBillingDataPaths(properties, [], matches)

  return matches.map((path) => ({
    message: ERROR_MESSAGE,
    path: _.concat(ctx.path, PROPERTIES, path),
  }))
}
