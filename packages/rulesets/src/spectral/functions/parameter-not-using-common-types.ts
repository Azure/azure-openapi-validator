// Verifies that parameters already defined in common-types are not being redefined.

export const parameterNotUsingCommonTypes = (parameters: any, _opts: any, ctx: any) => {
  if (parameters === null || !Array.isArray(parameters)) {
    return []
  }
  if (parameters.length === 0) {
    return []
  }

  // TODO: maybe read this from the most recent common-types/resource-management/v#/types.json
  const commonTypesParametersNames = new Set([
    "subscriptionId",
    "api-version",
    "resourceGroupName",
    "operationId",
    "location",
    "managementGroupName",
    "scope",
    "tenantId",
    "ifMatch",
    "ifNoneMatch",
  ])

  const swagger = ctx?.documentInventory?.resolved

  const allParams = parameters.concat(Object.values(swagger?.parameters ?? []))
  const paramsWithNameProperty = allParams.filter((param) => Object.keys(param).includes("name"))
  const paramNames = paramsWithNameProperty.map((param) => param.name)
  const paramsFromCommonTypes = paramNames.filter((pName) => commonTypesParametersNames.has(pName))
  const errors = paramsFromCommonTypes.map((pName) => {
    return {
      message: `Not using the common-types defined parameter "${pName}".`,
      path: ctx.path,
    }
  })

  return errors
}
