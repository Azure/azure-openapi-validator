/**
 * get all properties as array
 */
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

/**
 * get all specific property as array
 */
export function getProperty(schema: any, propName: string): any {
  if (!schema) {
    return {}
  }
  if (schema.allOf && Array.isArray(schema.allOf)) {
    for (const base of schema.allOf) {
      const result = getProperty(base, propName)
      if (result) {
        return result
      }
    }
  }
  if (schema.properties) {
    if (propName in schema.properties) {
      return schema.properties[propName]
    }
  }
  return undefined
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

/**
 *
 * @param paths json pointer as an array , like ["paths","/foo"]
 * @param root source doc to search
 * @returns the found object
 */
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

// diff A  B , return the properties in A but not present in B with the same layout
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

export function getGetOperationSchema(paths: string[], ctx: any) {
  const getOperationPath = [...paths, "get"]
  const getOperation = jsonPath(getOperationPath, ctx?.documentInventory?.resolved)
  if (!getOperation) {
    return undefined
  }
  return getOperation?.responses["200"]?.schema || getOperation?.responses["201"]?.schema
}

export function isPageableOperation(operation: any) {
  return !!operation?.["x-ms-pageable"]
}

export function getReturnedType(operation: any) {
  const succeededCodes = ["200", "201", "202"]
  for (const code of succeededCodes) {
    const response = operation.responses[code]
    if (response) {
      return response?.schema?.$ref
    }
  }
}

export function getReturnedSchema(operation: any) {
  const succeededCodes = ["200", "201"]
  for (const code of succeededCodes) {
    const response = operation.responses[code]
    if (response?.schema) {
      return response?.schema
    }
  }
}

export function isXmsResource(schema: any) {
  if (!schema) {
    return false
  }
  if (schema["x-ms-azure-resource"]) {
    return true
  }
  if (schema.allOf && Array.isArray(schema.allOf)) {
    for (const base of schema.allOf) {
      if (isXmsResource(base)) {
        return true
      }
    }
  }
  return false
}

export function isSchemaEqual(a: any, b: any): boolean {
  if (a && b) {
    const propsA = Object.getOwnPropertyNames(a);
    const propsB = Object.getOwnPropertyNames(b);
    if (propsA.length !== propsB.length) {
      return false;
    }
    for (const propsAName of propsA) {
      const [propA, propB] = [a[propsAName], b[propsAName]];
      if (typeof propA === "object") {
        if (!isSchemaEqual(propA, propB)) {
          return false;
        }
      } else if (propA !== propB) {
        return false;
      }
    }
  }
  return true;
}
