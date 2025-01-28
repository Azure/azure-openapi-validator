/**
 * Suggests combining paths that differ only in scope by defining a scope parameter.
 *
 * This function checks if the given path can be combined with other paths in the Swagger document
 * by introducing a scope parameter. It returns suggestions for paths that differ only in scope.
 */
import _ from "lodash"

const suggestScopeParameter = (paths: any, _opts: any, ctx: any) => {
  if (paths === null || typeof paths !== "object") {
    return []
  }

  const keys = Object.keys(paths)
  if (!Array.isArray(keys) || keys.length === 0 || !keys.every((p) => typeof p === "string")) {
    return []
  }

  // Find paths that do not start with the scope parameter
  const scopedPaths = keys.filter((p: string) => !p.startsWith("{scope}"))

  const errors = []

  for (const scopedPath of scopedPaths) {
    // Find other paths that differ only in scope
    const otherPaths = scopedPaths.filter(
      (p: string) =>
        p !== scopedPath &&
        // Paths have the same "/providers/..." suffix
        p.endsWith(scopedPath[0].substring(scopedPath.indexOf("/providers"))),
    )

    if (otherPaths.length > 0) {
      errors.push(
        otherPaths.map((p) => {
          return {
            message: "placeholder error message", //`Path "${p}" differs from path "${scopedPath}" only in scope. These paths can be combined by defining a scope parameter.`,
            path: "placeholder path", //.concat(p),
          }
        }),
      )
    }
  }

  return errors
}

export default suggestScopeParameter
