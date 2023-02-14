import { getProperty, getProperties } from "./utils"

export const provisioningStateSpecifiedForLROPatch = (patchOp: any, _opts: any, ctx: any) => {
  if (patchOp === null || typeof patchOp !== "object") {
    return []
  }

  const path = ctx.path || []
  const errors = []

  const allProperties = getProperties(patchOp.schema)
  const provisioningStateProperty = getProperty(allProperties?.properties, "provisioningState")
  if (provisioningStateProperty === undefined || Object.keys(provisioningStateProperty).length === 0) {
    errors.push({
      message: `200 response schema in long running PATCH operation is missing ProvisioningState property. A LRO PATCH operations 200 response schema must have ProvisioningState specified.`,
      path,
    })
  }

  return errors
}

export default provisioningStateSpecifiedForLROPatch
