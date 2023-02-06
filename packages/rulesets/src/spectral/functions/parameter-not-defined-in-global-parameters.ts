// This rule passes if the parameters section contains both subscriptionId and api-version parameters.

const pushToError = (errors: any[], parameter: string, path: string[]) => {
  errors.push({
    message: `Parameter "${parameter}" is referenced but not defined in the global parameters section of Service Definition`,
    path: [...path],
  })
}

export const parameterNotDefinedInGlobalParameters = (parameters: any, _opts: any, ctx: any) => {
  if (parameters === null || !Array.isArray(parameters)) {
    return []
  }
  if (parameters.length === 0) {
    return []
  }
  const path = ctx.path || []
  const errors: any = []
  const globalParametersList = []
  const swagger = ctx?.documentInventory?.resolved
  if (swagger.parameters) {
    for (const parameters in swagger.parameters) {
      const parameterName = swagger.parameters[parameters].name
      globalParametersList.push(parameterName)
    }
    // Check if subscriptionId is used but not defined in global parameters
    for (const parameter of parameters) {
      if (parameter.name && parameter.name === "subscriptionId" && !globalParametersList.includes("subscriptionId")) {
        pushToError(errors, "subscriptionId", path)
      }
    }
    const commonTypeApiVersionReg = /.*common-types\/resource-management\/v\d\/types\.json#\/parameters\/ApiVersionParameter/gi
    // For ARM specs, api version is almost always required, call it out if it isn't defined in the global params
    // We are not distinguishing between ARM and non-ARM specs currently, so let's apply this for all specs regardless
    // and make appropriate changes in the future so this gets applied only for ARM specs
    if (!globalParametersList.includes("api-version") && !parameters.some((p) => p.$ref && commonTypeApiVersionReg.test(p.$ref))) {
      pushToError(errors, "api-version", path)
    }
  }

  return errors
}
