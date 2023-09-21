//This rule applies when the provisioning state doesn't include enum value ['Succeeded','Failed','Canceled']
import { getProperty, getProperties } from "./utils"

export const provisioningStateValidation = (schema: any, _opts: any, ctx: any) => {
  if (schema === null || typeof schema !== "object") {
    return []
  }

  const path = ctx.path || []
  const valuesMustHave = ["succeeded", "failed", "canceled"]
  const allProperties = getProperties(schema)
  const provisioningStateProperty = getProperty(allProperties?.properties, "provisioningState")

  if (provisioningStateProperty === undefined || Object.keys(provisioningStateProperty).length === 0) {
    return []
  }

  const enumValue: string[] = provisioningStateProperty["enum"]

  if (enumValue && valuesMustHave.some((v: string) => !enumValue.some((ev) => ev.toLowerCase() === v))) {
    return [
      {
        message: "ProvisioningState must have terminal states: Succeeded, Failed and Canceled.",
        path,
      },
    ]
  }

  return []
}
