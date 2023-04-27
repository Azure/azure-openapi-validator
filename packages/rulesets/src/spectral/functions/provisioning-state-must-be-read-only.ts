import { getProperty, getProperties } from "./utils"

export const provisioningStateMustBeReadOnly = (schema: any, _opts: any, ctx: any) => {
  if (schema === null || typeof schema !== "object") {
    return []
  }

  const path = ctx.path || []
  const errors = []

  const allProperties = getProperties(schema)
  const provisioningStateProperty = getProperty(allProperties?.properties, "provisioningState")
  if (provisioningStateProperty === undefined || Object.keys(provisioningStateProperty).length === 0) {
    return []
  }
  const provisioningStatePropertyReadOnly = provisioningStateProperty["readOnly"]

  if (!provisioningStatePropertyReadOnly || provisioningStatePropertyReadOnly !== true) {
    errors.push({
      message: "provisioningState property must be set to readOnly.",
      path,
    })
  }

  return errors
}
