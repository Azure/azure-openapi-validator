export function getProperties(schema: any) {
  if (!schema) {
    return {}
  }
  let properties: any = {}
  if (schema.allOf && Array.isArray(schema.allOf)) {
    schema.allOf.forEach((base: any) => {
      properties = { ...getProperties(base), ...properties }
    })
  }
  if (schema.properties) {
    properties = { ...properties, ...schema.properties }
  }
  return properties
}

export function getRequiredProperties(schema: any) {
  if (!schema) {
    return []
  }
  let requires: string[] = []
  if (schema.allOf && Array.isArray(schema.allOf)) {
    schema.allOf.forEach((base: any) => {
      requires = [...getRequiredProperties(base), ...requires]
    })
  }
  if (schema.required) {
    requires = [...schema.required, requires]
  }
  return requires
}
export type JsonPath = (string | number)[]

export function jsonPath(paths: JsonPath, root: any) {
  let result = undefined
  paths.some((p) => {
    if (typeof root !== "object" && root !== null) {
      result = undefined
      return true
    }
    root = root[p as any]
    result = root
    return false
  })
  return result
}
