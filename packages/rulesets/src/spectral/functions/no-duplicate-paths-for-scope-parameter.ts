// Check that the any paths with the scope parameter are not also defined with an explicit scope.
// These duplicate paths break ARM Schema generation. ARM Schemas are used in an Export Template,
// failing to generate schemas results in customers not able to export all resources from a resource group.

const scopeParameter = "{scope}"

const noDuplicatePathsForScopeParameter = (path: any, _opts: any, ctx: any) => {
  const swagger = ctx?.documentInventory?.resolved

  if (path === null || typeof path !== "string" || path.length === 0 || swagger === null) {
    return []
  }

  const pathRegEx = new RegExp(path.replace(scopeParameter, ".*"))

  // check each explicitly-scoped path to see if it is already defined by the variably-scoped path
  const otherPaths = Object.keys(swagger.paths).filter((p: string) => p !== path)

  const matches = otherPaths.filter((p: string) => pathRegEx.test(p))

  const errors = matches.map((match: string) => {
    return {
      message: `Path with explicitly defined scope "${match}" is a duplicate of path "${path}" that has the scope parameter.".`,
      path: ctx.path,
    }
  })

  return errors
}

export default noDuplicatePathsForScopeParameter
