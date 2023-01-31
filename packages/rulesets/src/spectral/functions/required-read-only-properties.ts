// Validates if a property is marked as required, it should not be read only

export const requiredReadOnlyProperties = (definition: any, _opts: any, ctx: any) => {
  if (definition === null || typeof definition !== "object") {
    return []
  }
  if (!Array.isArray(definition.required) || (Array.isArray(definition.required) && definition.required.length === 0)) {
    return []
  }
  if (!definition.properties) {
    return []
  }
  const path = ctx.path || []
  const errors: any = []
  const required = definition.required
  const properties = definition.properties
  for (const property in properties) {
    if (properties[property].readOnly === true && required.includes(property)) {
      errors.push({
        message: `Property '${property}' is a required property. It should not be marked as 'readonly'`,
        path: [...path],
      })
    }
  }
  return errors
}
