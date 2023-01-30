// Check that the any paths with the scope parameter are not also defined with an explicit scope.
// These duplicate paths break ARM Schema generation. ARM Schemas are used in an Export Template,
// failing to generate schemas results in customers not able to export all resources from a resource group.

import { RulesetFunctionContext } from "@stoplight/spectral-core"

const scopeParameter = "{scope}"

const noDuplicatePathsForScopeParameter = (path: any, _opts: any, ctx: any) => {
  const swagger = ctx?.documentInventory?.resolved

  if (path === null || typeof path === "string" || path.length === 0 || swagger === null) {
    return []
  }

  const pathRegEx = new RegExp(path.replace(scopeParameter, ".*"))

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
