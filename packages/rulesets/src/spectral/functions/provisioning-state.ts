//This rule applies when the provisioning state doesn't include enum value ['Succeeded','Failed','Canceled']
const provisioningState = (swaggerObj: any, _opts: any, paths: any) => {
  const enumValue: string[] = swaggerObj.enum
  if (swaggerObj === null || typeof swaggerObj !== "object" || enumValue === null || enumValue === undefined) {
    return []
  }

  if (!Array.isArray(enumValue)) {
    return []
  }
  const path = paths.path || []
  const valuesMustHave = ["succeeded", "failed", "canceled"]
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

export default provisioningState
