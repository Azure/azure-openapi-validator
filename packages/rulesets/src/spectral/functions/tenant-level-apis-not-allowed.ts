// This rule checks for tenant level paths of PUT operation and flags errors if found

export const tenantLevelAPIsNotAllowed = (pathItems: any, _opts: any, ctx: any) => {
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
        message: `${apiPath} is a tenant level api. Tenant level APIs are strongly discouraged and subscription or resource group level APIs are preferred instead. Please note that these APIs require a review from the security RBAC team during manifest check-in. For details, refer to the Manifest security review process: https://eng.ms/docs/microsoft-security/identity/auth-authz/access-control-managed-identityacmi/policy-administration-service/pas-wiki/livesite/security/manifest`,
        path: [...path, apiPath],
      })
      break
    }
  }
  return errors
}
