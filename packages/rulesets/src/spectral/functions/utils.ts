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

export function jsonPath(paths: JsonPath, root: any): any {
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

// diff A  B , return the properties in A but not present in B with the same structure
export function diffSchema(a: any, b: any) {
  const notMatchedProperties: string[] = []
  function diffSchemaInternal(a: any, b: any, paths: string[]) {
    if (!(a || b)) {
      return
    }
    if (a && b) {
      const propsA = getProperties(a)
      const propsB = getProperties(b)
      Object.keys(propsA).forEach((p: string) => {
        if (propsB[p]) {
          diffSchemaInternal(propsA[p], propsB[p], [...paths, p])
        } else {
          notMatchedProperties.push([...paths, p].join("."))
        }
      })
    }
  }
  diffSchemaInternal(a, b, [])
  return notMatchedProperties
}
