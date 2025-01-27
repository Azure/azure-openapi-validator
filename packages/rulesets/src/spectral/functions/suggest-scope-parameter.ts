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

  const entries = Object.entries(paths)
  if (
    !Array.isArray(entries) ||
    entries.length === 0 ||
    !entries.every((p) => Array.isArray(p)) ||
    !entries.every((p) => p.length === 2) ||
    !entries.every((p) => typeof p[0] === "string") ||
    !entries.every((p) => typeof p[1] === "object")
  ) {
    return []
  }

  // Find paths that do not start with the scope parameter
  const scopedPaths = entries.filter((p: Array<any>) => !p[0].startsWith("{scope}"))

  const errors = []

  for (const scopedPath of scopedPaths) {
    // Find other paths that differ only in scope
    const otherPaths = scopedPaths.filter(
      (p: Array<any>) =>
        p[0] !== scopedPath[0] &&
        // Paths have the same "/providers/..." suffix
        p[0].endsWith(scopedPath[0].substring(scopedPath[0].indexOf("/providers"))),
    )

    if (otherPaths.length > 0) {
      errors.push(
        otherPaths.map((p) => {
          return {
            message: `Path "${p}" differs from path "${scopedPath}" only in scope. These paths can be combined by defining a scope parameter.`,
            path: ctx.path,
          }
        }),
      )
    }
  }

  return errors
}

export default suggestScopeParameter
