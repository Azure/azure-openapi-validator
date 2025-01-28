/**
 * Suggests combining paths that differ only in scope by defining a scope parameter.
 *
 * This function checks if the given path can be combined with other paths in the Swagger document
 * by introducing a scope parameter. It returns suggestions for paths that differ only in scope.
 */
import _ from "lodash"

const suggestScopeParameter = (path: any, _opts: any, ctx: any) => {
  const swagger = ctx?.documentInventory?.resolved

  if (path === null || typeof path !== "string" || path.length === 0 || swagger === null) {
    return []
  }

  // Find all paths that differ only in scope
  // TODO: this can also probably check paths that start with scope
  const matchingPaths = Object.keys(swagger.paths).filter(
    (p: string) => !p.startsWith("{scope}") && p !== path && p.endsWith(path.substring(path.indexOf("/providers"))),
  )

  return matchingPaths.map((match: string) => {
    return {
      message: `Path "${match}" differs from path "${path}" only in scope. These paths can be combined by defining a scope parameter.`,
      path: ctx.path.concat(match),
    }
  })
}

export default suggestScopeParameter
