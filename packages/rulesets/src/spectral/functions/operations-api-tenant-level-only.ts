// OperationsApiTenantLevelOnly
// GET operations API MUST be scoped tenant-wide (operations should *not* vary per subscription)

const OPERATIONS = "operations"
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

  for (let pathName of keys) {
    if (pathName.toString().endsWith(OPERATIONS) && pathItem[pathName][GET] && !pathName.match(/^\/providers\/[^\/]+\/operations/)) {
      errors.push({ message: "The operations API must only be at the tenant level.", path: [...path, pathName, GET] })
    }
  }

  return errors
}
