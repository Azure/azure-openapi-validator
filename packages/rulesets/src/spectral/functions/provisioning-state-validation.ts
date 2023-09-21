//This rule applies when the provisioning state doesn't include enum value ['Succeeded','Failed','Canceled']
import { getProperty } from "./utils"

export const provisioningStateValidation = (schema: any, _opts: any, ctx: any) => {
  if (schema === null || typeof schema !== "object") {
    return []
  }

  const path = ctx.path || []
  const mustHaveValues = ["succeeded", "failed", "canceled"]

  const provisioningStateProperty = getProperty(schema, "provisioningState")


  if (provisioningStateProperty === undefined || Object.keys(provisioningStateProperty).length === 0) {
    return []
  }

  const enumValue: string[] = provisioningStateProperty["enum"]

  if (!enumValue || mustHaveValues.some((value: string) => !enumValue.some((ev) => ev.toLowerCase() === value))) {
    return [
      {
        message: "ProvisioningState must have terminal states: Succeeded, Failed and Canceled.",
        path,
      },
    ]
  }

  return []
}
