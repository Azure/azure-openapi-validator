// Verifies that parameters already defined in common-types are not being redefined.

export const parameterNotUsingCommonTypes = (parametersName: any, _opts: any, ctx: any) => {
  if (parametersName === null) {
    return []
  }

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

  const errors = []
  const path = ctx.path

  const checkCommonTypes = commonTypesParametersNames.has(parametersName)
  if (checkCommonTypes) {
    errors.push({
      message: `Not using the common-types defined parameter "${parametersName}".`,
      path: path,
    })
  }
  return errors
}
