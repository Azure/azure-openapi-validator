// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

type DataType =
  | "integer"
  | "number"
  | "string"
  | "boolean"
  | "null"
  | "object"
  | "array"

type SchemaObject = {
  type?: DataType
  properties?: Array<SchemaObject>
  $ref?: string
  allOf?: ReadonlyArray<SchemaObject>
}

const skipIfUndefined = <T>(f: (v: T) => T): ((v: T | undefined) => T | undefined) => v =>
  v !== undefined ? f(v) : undefined


/**
 * @param schema 
 * Per https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md
 * the swagger schema object allows some json schema keywords: allOf,properties,additionalProperties,items
 * this function will resolve the keywords : allOf properties , return a flatted schema object
 */
export function resolveNestedSchema(schema: SchemaObject): SchemaObject {
  const seen = new WeakSet()
  const propertySetMap = (schema: SchemaObject, resolveFuncs: any): SchemaObject => {
    let copySchema = copyObject(schema)
    for (let k in schema) {
      if (resolveFuncs[k]) {
        let result = resolveFuncs[k](schema[k])
        delete copySchema[k]
        copyProperties(result, copySchema)
      }
      else if (typeof schema[k] === "object") {
        let copy = resolveNestedSchemaObject(schema[k])
        copySchema[k] = copy
      }
    }
    return copySchema
  }

  const copyObject = (source: any): any => {
    let copy = Object.assign({}, source);
    return copy
  }

  const copyProperties = (source: any, dest: any) => {
    if (!source || !dest) {
      return
    }
    for (let k in source) {
      if (typeof source[k] !== "object") {
        if (!dest[k]) {
          dest[k] = source[k]
        }
      }
      else {
        if (!dest[k]) {
          dest[k] = copyObject(source[k]);
        }
      }
    }
  }

  // a function to resolve nested schema objects
  const resolveNestedSchemaObject = (schemaObject: SchemaObject) => {

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
    return resolveSchemaObject(schemaObject)
  }
  // a function to resolve SchemaObject array
  const resolveOptionalSchemaObjectArray = (
    schemaObjectArray: SchemaObject[] | undefined
  ): SchemaObject[] | undefined => {
    if (schemaObjectArray) {
      let copyschema = copyObject(schemaObjectArray);
      schemaObjectArray.forEach(function (v, k) {
        let result = resolveNestedSchemaObject(schemaObjectArray[k])
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
      properties: skipIfUndefined(resolveNestedSchemaObject),
      allOf: resolveOptionalSchemaObjectArray
    })
    return result
  }

  return resolveSchemaObject(schema)
}
