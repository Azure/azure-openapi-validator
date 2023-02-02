// Validates if the swagger parameter has the "name" property set.

export const namePropertyDefinitionInParameter = (parameters: any, _opts: any, ctx: any) => {
  if (parameters === null || typeof parameters !== "object") {
    return []
  }
  const path = ctx.path || []
  const errors: any = []
  const propsParameters = Object.getOwnPropertyNames(parameters)
  if (propsParameters.length === 0) {
    return []
  }
  for (const propsParameter of propsParameters) {
    if (propsParameter === "length") {
      continue
    }
    const parameter = parameters[propsParameter]
    if (!parameter.name || parameter.name === "") {
      errors.push({
        message: `Parameter Must have the "name" property defined with non-empty string as its value`,
        path: [...path],
      })
    }
  }
  return errors
}
