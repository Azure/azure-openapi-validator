// Validates if the swagger parameter has the "name" property set.

export const namePropertyDefinitionInParameter = (parameters: any, _opts: any, ctx: any) => {
  if (parameters === null || !Array.isArray(parameters)) {
    return [];
  }
  if (parameters.length === 0) {
    return [];
  }
  const path = ctx.path || [];
  const errors: any = [];
  for (const parameter of parameters) {
    if (!parameter.name || parameter.name === "") {
      errors.push({
        message: `Parameter Must have the "name" property defined with non-empty string as its value`,
        path: [...path],
      });
    }
  }
  return errors;
};
