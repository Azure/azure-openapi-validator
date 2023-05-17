// OperationsApiTenantLevelOnly
// GET operations API MUST be scoped tenant-wide (operations should *not* vary per subscription)
//
// This rule checks for paths that end with /operations and are not at the tenant level. For example,
//
// Tenant level: "/providers/Microsoft.Bakery/operations"
// Not tenant level: "/subscriptions/{subscriptionId}/providers/Microsoft.Bakery/operations"

const OPERATIONS = "/operations"
const GET = "get"

export const operationsApiTenantLevelOnly = (pathItem: any, _opts: any, ctx: any) => {
  if (pathItem === null || typeof pathItem !== "object") {
    return []
  }
  const path = ctx.path || []
  const keys = Object.keys(pathItem)
  if (keys.length < 1) {
    return []
  }

  const errors = []

  for (const pathName of keys) {
    if (pathName.toString().endsWith(OPERATIONS) && pathItem[pathName][GET] && !pathName.match(/^\/providers\/[^/]+\/operations/)) {
      errors.push({
        message: "The get operations endpoint for the operations API must only be at the tenant level.",
        path: [...path, pathName, GET],
      })
    }
  }

  return errors
}
