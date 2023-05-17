import { getProperty, getProperties } from "./utils"

export const provisioningStateSpecifiedForLRODelete = (deleteOp: any, _opts: any, ctx: any) => {
  if (deleteOp === null || typeof deleteOp !== "object") {
    return []
  }

  const path = ctx.path || []
  const errors = []

  const allProperties = getProperties(deleteOp.schema)
  const provisioningStateProperty = getProperty(allProperties?.properties, "provisioningState")
  if (provisioningStateProperty === undefined || Object.keys(provisioningStateProperty).length === 0) {
    errors.push({
      message: `200 response schema in long running DELETE operation is missing ProvisioningState property. A LRO DELETE operations 200 response schema must have ProvisioningState specified.`,
      path,
    })
  }

  return errors
}

export default provisioningStateSpecifiedForLRODelete
