const sensitiveKeywords = ["access", "credential", "secret", "password", "key", "token", "auth", "connection"]

const excludeKeywords = ["publicKey"].map((keyword) => keyword.toLowerCase())

function isPotentialSensitiveProperty(propertyName: string): boolean {
  const lowerName = propertyName.toLowerCase()
  return (
    sensitiveKeywords.some((keyword) => lowerName.endsWith(keyword) && !lowerName.startsWith(keyword)) &&
    !excludeKeywords.some((keyword) => lowerName.endsWith(keyword) && !lowerName.startsWith(keyword))
  )
}

function isKeyValuePairKeyProp(propertiesKeys: any): boolean {
  return propertiesKeys.includes("key") && propertiesKeys.includes("value")
}

export const XMSSecretInResponse = (properties: any, _opts: any, ctx: any) => {
  if (properties === null || typeof properties !== "object") {
    return []
  }

  const path = ctx.path || []
  const errors: any[] = []
  const propertiesSize = Object.keys(properties).length
  const propertiesKeys = Object.keys(properties)
  const keyValuePairCheck = propertiesSize === 2 && isKeyValuePairKeyProp(propertiesKeys)

  // Check top-level and deeply nested properties
  for (const prpName of propertiesKeys) {
    if (prpName === "properties" && typeof properties[prpName] === "object") {
      errors.push(...XMSSecretInResponse(properties[prpName], _opts, { ...ctx, path: [...path, prpName] }))
    } else {
      // Add all conditions for secret detection
      if (
        isPotentialSensitiveProperty(prpName) && // property name matches sensitive keywords
        !prpName.toLowerCase().includes("public") && // skip properties containing "public"
        properties[prpName] && // property exists
        properties[prpName]["x-ms-secret"] !== true && // not explicitly marked as secret
        !keyValuePairCheck && // not a key-value pair key
        properties[prpName].type === "string" && // property type is string
        !properties[prpName].enum && // not a standard enum property
        !properties[prpName]["x-ms-enum"] // not an x-ms-enum property
      ) {
        errors.push({
          message: `Property '${prpName}' contains secret keyword and does not have 'x-ms-secret' annotation. To ensure security, must add the 'x-ms-secret' annotation to this property.`,
          path: [...path, prpName],
        })
      }
    }
  }

  return errors
}

export default XMSSecretInResponse
