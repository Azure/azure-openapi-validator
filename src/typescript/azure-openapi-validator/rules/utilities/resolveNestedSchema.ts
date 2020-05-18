// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

type DataType = "integer" | "number" | "string" | "boolean" | "null" | "object" | "array"

interface SchemaObject {
  type?: DataType
  properties?: ReadonlyArray<SchemaObject>
  $ref?: string
  allOf?: ReadonlyArray<SchemaObject>
}

const skipIfUndefined = <T>(f: (v: T) => T): ((v: T | undefined) => T | undefined) => v => (v !== undefined ? f(v) : undefined)

/**
 * @param schema
 * Per https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md
 * the swagger schema object allows some json schema keywords: allOf,properties,additionalProperties,items
 * this function will resolve the keywords : allOf properties , return a flatted schema object
 */
export function resolveNestedSchema(schema: SchemaObject): SchemaObject {
  const seen = new WeakSet()
  const propertySetMap = (schemaObject: SchemaObject, resolveFuncs: any): SchemaObject => {
    const copySchema = copyObject(schemaObject)
    for (const k in schemaObject) {
      // schema keyword
      if (resolveFuncs[k]) {
        const result = resolveFuncs[k](schemaObject[k])
        delete copySchema[k]
        copyProperties(result, copySchema)
      } else if (typeof schemaObject[k] === "object") {
        // normal schema object e.g. { type:string,minLength:1}
        copySchema[k] = resolveSchemaObject(schemaObject[k])
      }
    }
    return copySchema
  }

  const copyObject = (source: any): any => {
    const copy = Object.assign({}, source)
    return copy
  }

  const copyProperties = (source: any, dest: any) => {
    if (!source || !dest) {
      return
    }
    for (const k in source) {
      if (typeof source[k] !== "object") {
        if (!dest[k]) {
          dest[k] = source[k]
        }
      } else {
        if (!dest[k]) {
          dest[k] = copyObject(source[k])
        } else {
          copyProperties(source[k], dest[k])
        }
      }
    }
  }

  // a function to resolve properties schema objects
  const resolvePropertiesSchemaObject = (schemaObject: SchemaObject) => {
    if (typeof schemaObject !== "object") {
      return schemaObject
    }

    // resolve circular reference
    if (seen.has(schemaObject)) {
      return schemaObject
    }
    seen.add(schemaObject)

    // ignore references
    if (schemaObject.$ref) {
      return schemaObject
    }
    // ignore primitive types
    switch (schemaObject.type) {
      case "integer":
      case "number":
      case "string":
      case "boolean":
      case "null":
        return schemaObject
    }
    /**
     * Since this object schemaObject is under the keyword: properties
     * Its properties won't be a keyword again, so here we need to get its all properties then invoke resolveSchemaObject in a loop
     * , not to invoke resolveSchemaObject directly because that will cause the `properties` property be considered
     * as the keyword properties
     * e.g.
     * { --- root Object
     *   properties : --- this is keyword
     *   { --- schemaObject under keyword 
     *     "properties":{  --- this is a property
     *       type:"string"
     *     },
     *    "another propertie":{
     *    }
     *   }
     * }
     */
    const copySchema = copyObject(schemaObject)
    for (const prop in schemaObject) {
      if (typeof copySchema[prop] === "object") {
        copySchema[prop] = resolveSchemaObject(schemaObject[prop])
      }
    }
    return copySchema
  }
  // a function to resolve allOf array
  const resolveOptionalSchemaObjectArray = (schemaObjectArray: SchemaObject[] | undefined): SchemaObject[] | undefined => {
    if (schemaObjectArray) {
      const copyschema = copyObject(schemaObjectArray)
      schemaObjectArray.forEach(function(v, k) {
        const result = resolveSchemaObject(schemaObjectArray[k])
        delete copyschema[k]
        copyProperties(result, copyschema)
      })
      return copyschema
    }
    return schemaObjectArray
  }
  // a function to resolve SchemaObject (top-level and nested)
  const resolveSchemaObject = (schemaObject: SchemaObject): SchemaObject => {
    const result = propertySetMap(schemaObject, {
      properties: skipIfUndefined(resolvePropertiesSchemaObject),
      allOf: resolveOptionalSchemaObjectArray
    })
    return result
  }

  return resolveSchemaObject(schema)
}
