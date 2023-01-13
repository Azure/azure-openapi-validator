// Check that the any paths with the scope parameter are not also defined with an explicit scope.
// These duplicate paths break ARM Schema generation. ARM Schemas are used in an Export Template,
// failing to generate schemas results in customers not able to export all resources from a resource group.

const scopeParameter = "{scope}"

const noDuplicatePathsForScopeParameter = (paths: any, _opts: any, ctx: any) => {
  if (paths === null || !Array.isArray(paths) || paths.length === 0) {
    return []
  }

  const pathsWithExplicitScopes: string[] = []
  const pathsWithVariableScopes: string[] = []

  paths.forEach((path: string) => {
    if (path.includes(scopeParameter)) {
      pathsWithVariableScopes.push(path)
    } else {
      pathsWithExplicitScopes.push(path)
    }
  })

  if (pathsWithVariableScopes.length === 0 || pathsWithExplicitScopes.length === 0) {
    return []
  }

  // "/path/{scope}/operation" becomes a key value pair with key: regex /path/.*/operation, and value: "/path/{scope}/operation"
  const pathsWithVariableScopesByPathRegExp = new Map<RegExp, string>(
    pathsWithVariableScopes.map((path: string) => [new RegExp(path.replace(scopeParameter, ".*")), path])
  )

  // array of explicitly-scoped paths that duplicate a path with the scope paramter
  const matches: { pathWithScopeParameter: string; pathWithExplicitScope: string }[] = []

  // check each explicitly-scoped path to see if it is already defined with a variably-scoped path
  pathsWithExplicitScopes.forEach((path: string) => {
    for (const regexp of pathsWithVariableScopesByPathRegExp.keys()) {
      if (regexp.test(path)) {
        matches.push({
          pathWithScopeParameter: pathsWithVariableScopesByPathRegExp.get(regexp) ?? "",
          pathWithExplicitScope: path,
        })
      }
    }
  })

  const errors = matches.map((match) => {
    return {
      message: `Path with explicitly defined scope "${match.pathWithExplicitScope}" is a duplicate of path "${match.pathWithScopeParameter}" that has the scope parameter.".`,
      path: ctx.path,
    }
  })

  return errors
}

export default noDuplicatePathsForScopeParameter
