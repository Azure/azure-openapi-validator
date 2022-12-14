// Verifies that parameters already defined in common-types are not being redefined.

export const parameterNotUsingCommonTypes = (parameters: any, _opts: any, ctx: any) => {
  if (parameters === null || !Array.isArray(parameters)) {
    return []
  }
  if (parameters.length === 0) {
    return []
  }

  // TODO: maybe read this from the most recent common-types/resource-management/v#/types.json
  const commonTypesParametersNames = [
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
  ]

  const swagger = ctx?.documentInventory?.resolved

  // TODO: remove
  console.log(parameters)

  const allParams = parameters.concat(Object.values(swagger?.parameters ?? []))
  const paramsWithNames = allParams.filter((param) => Object.keys(param).length > 0).filter((param) => Object.keys(param).includes("name"))
  const paramNames = paramsWithNames.map((param) => param.name)
  const paramsWithNamesThatAreCommonTypes = paramNames.filter((pName) => commonTypesParametersNames.includes(pName))
  const errors = paramsWithNamesThatAreCommonTypes.map((pName) => {
    return {
      message: `Not using the common-types defined parameter "${pName}".`,
      path: ctx.path,
    }
  })

  return errors
}
