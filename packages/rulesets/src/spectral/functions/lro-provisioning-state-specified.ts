import { getProperty, getProperties } from "./utils"

export const provisioningStateSpecified = (pathItem: any, _opts: any, ctx: any) => {
  if (pathItem === null || typeof pathItem !== "object") {
    return []
  }

  const neededHttpVerbs = ["put", "patch"]
  const putCodes = ["200", "201"]
  const patchCodes = ["200"]
  const path = ctx.path || []
  const errors = []

  for (const verb of neededHttpVerbs) {
    if (pathItem[verb]) {
      let codes = []
      if (verb === "patch") {
        codes = patchCodes
      } else {
        codes = putCodes
      }

      for (const code of codes) {
        var allProperties = getProperties(pathItem[verb].responses[code]?.schema)
        var provisioningStateProperty = getProperty(allProperties?.properties, "provisioningState")
        if (Object.keys(provisioningStateProperty).length === 0) {
          errors.push({
            message: `${code} response schema in long running ${verb} operation is missing ProvisioningState property. A LRO PUT and PATCH operations response schema must have ProvisioningState specified.`,
            path,
          })
        }
      }
    }
  }

  return errors
}

export default provisioningStateSpecified
