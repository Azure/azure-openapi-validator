import { getProperty, getProperties } from "./utils"

export const provisioningStateSpecifiedForLROPut = (putOp: any, _opts: any, ctx: any) => {
  if (putOp === null || typeof putOp !== "object") {
    return []
  }

  const putCodes = ["200", "201"]
  const path = ctx.path || []
  const errors = []

  for (const code of putCodes) {
    const allProperties = getProperties(putOp.responses[code]?.schema)
    const provisioningStateProperty = getProperty(allProperties?.properties, "provisioningState")
    if (provisioningStateProperty === undefined || Object.keys(provisioningStateProperty).length === 0) {
      errors.push({
        message: `${code} response schema in long running PUT operation is missing ProvisioningState property. A LRO PUT operations response schema must have ProvisioningState specified.`,
        path,
      })
    }
  }

  return errors
}

export default provisioningStateSpecifiedForLROPut
