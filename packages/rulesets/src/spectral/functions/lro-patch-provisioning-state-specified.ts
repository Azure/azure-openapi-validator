import { getProperty, getProperties } from "./utils"

export const provisioningStateSpecifiedForLROPatch = (patchOp: any, _opts: any, ctx: any) => {
  if (patchOp === null || typeof patchOp !== "object") {
    return []
  }

  const patchCodes = ["200"]
  const path = ctx.path || []
  const errors = []

  for (const code of patchCodes) {
    const allProperties = getProperties(patchOp.responses[code]?.schema)
    const provisioningStateProperty = getProperty(allProperties?.properties, "provisioningState")
    if (Object.keys(provisioningStateProperty).length === 0) {
      errors.push({
        message: `${code} response schema in long running PATCH operation is missing ProvisioningState property. A LRO PATCH operations 200 response schema must have ProvisioningState specified.`,
        path,
      })
    }
  }

  return errors
}

export default provisioningStateSpecifiedForLROPatch
