// Validates if the swagger parameter has the "name" property set.

export const namePropertyDefinitionInParameter = (parameters: any, _opts: any, ctx: any) => {
  if (parameters === null || (!Array.isArray(parameters) && typeof parameters !== "object")) {
    return [];
  }
  const path = ctx.path || [];
  const errors: any = [];
  if (Array.isArray(parameters)) {
    if (parameters.length === 0) {
      return [];
    }
    for (const parameter of parameters) {
      if (!parameter.name || parameter.name === "") {
        errors.push({
          message: `Parameter Must have the "name" property defined with non-empty string as its value`,
          path: [...path],
        });
      }
    }
  } else {
    if (Object.keys(parameters).length === 0) {
      return [];
    }
    for (const parameterName in parameters) {
      const parameter = parameters[parameterName];
      if (!parameter.name || parameter.name === "") {
        errors.push({
          message: `Parameter Must have the "name" property defined with non-empty string as its value`,
          path: [...path],
        });
      }
    }
  }
  return errors;
};
