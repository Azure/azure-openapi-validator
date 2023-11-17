// This rule checks for tenant level paths of PUT operation and flags errors if found

export const exceptionMandateForTenantLevelApiPath = (pathItems: any, _opts: any, ctx: any) => {
  if (pathItems === null || typeof pathItems !== "object") {
    return []
  }

  const path = ctx.path || []
  const apiPaths = Object.keys(pathItems)
  if (apiPaths.length < 1) {
    return []
  }

  const errors: any[] = []

  // check for existence of tenant level paths & throw if exists
  for (const apiPath of apiPaths) {
    if (pathItems[apiPath]["put"] && !apiPath.endsWith("/operations") && apiPath.startsWith("/providers")) {
      errors.push({
        message: `${apiPath} is a tenant level api and will need exception from PAS team.`,
        path: [...path, apiPath],
      })
      break
    }
  }
  return errors
}
