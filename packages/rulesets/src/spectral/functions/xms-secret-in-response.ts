export const XMSSecretInResponse = (properties: any, _opts: any, ctx: any) => {
  if (properties === null || typeof properties !== "object") {
    return []
  }

  const secretKeywords = ["access", "credentials", "secret", "password", "key", "token", "auth", "connection"]
  const path = ctx.path || []
  const errors: any[] = []

  // Check top-level and deeply nested properties
  for (const prpName of Object.keys(properties)) {
    if (prpName === "properties" && typeof properties[prpName] === "object") {
      errors.push(...XMSSecretInResponse(properties[prpName], _opts, { ...ctx, path: [...path, prpName] }))
    } else {
      if (secretKeywords.some((keyword) => prpName.toLowerCase().includes(keyword))) {
        if (properties[prpName]["x-ms-secret"] !== true) {
          errors.push({
            message: `Property '${prpName}' contains secret keyword and does not have 'x-ms-secret' annotation. To ensure security, must add the 'x-ms-secret' annotation to this property.`,
            path: [...path, prpName],
          })
        }
      }
    }
  }

  return errors
}

export default XMSSecretInResponse
