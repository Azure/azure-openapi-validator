/**
 * Suggests combining paths that differ only in scope by defining a scope parameter.
 *
 * This function checks if the given path can be combined with other paths in the Swagger document
 * by introducing a scope parameter. It returns suggestions for paths that differ only in scope.
 */

// TODO: this can likely be combined with no-duplicate-paths-for-scope-parameter
const suggestScopeParameter = (path: any, _opts: any, ctx: any) => {
  const swagger = ctx?.documentInventory?.resolved

  let lowerCasePath: string

  if (
    path === null ||
    typeof path !== "string" ||
    path.length === 0 ||
    swagger === null ||
    (lowerCasePath = path.toLocaleLowerCase()).includes("{scope}")
  ) {
    return []
  }

  const suffix = path.substring(path.lastIndexOf("/providers")).toLocaleLowerCase()

  // Find all paths that differ only in scope
  const matchingPaths = Object.keys(swagger.paths).filter((p: string) => {
    const lower = p.toLocaleLowerCase()
    return !lower.includes("{scope}") && lower !== lowerCasePath && lower.endsWith(suffix)
  })

  return matchingPaths.map((match: string) => {
    return {
      // note: only matched path is included in the message so that Spectral can deduplicate errors
      message: `Path with suffix "${suffix}" differs from another path only in scope. These paths share a suffix and can be combined by defining a scope parameter.`,
      path: ctx.path,
    }
  })
}

export default suggestScopeParameter
