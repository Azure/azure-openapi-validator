/**
 * Suggests combining paths that differ only in scope by defining a scope parameter.
 *
 * This function checks if the given path can be combined with other paths in the Swagger document
 * by introducing a scope parameter. It returns suggestions for paths that differ only in scope.
 */
const suggestScopeParameter = (path: any, _opts: any, ctx: any) => {
  const swagger = ctx?.documentInventory?.resolved

  if (path === null || typeof path !== "string" || path.length === 0 || swagger === null || path.startsWith("{scope}")) {
    return []
  }

  const resourceTypeName = path.substring(path.lastIndexOf("/providers"))

  const otherPaths = Object.keys(swagger.paths).filter((p: string) => p !== path && p.endsWith(resourceTypeName))

  return otherPaths.map((p) => {
    return {
      message: `Path "${p}" differs from path "${path}" only in scope. These paths can be combined by defining a scope parameter.`,
      path: ctx.path,
    }
  })
}

export default suggestScopeParameter
