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
  items?: SchemaObject
  properties?: Array<SchemaObject>
  additionalProperties?: SchemaObject | boolean
  oneOf?: ReadonlyArray<SchemaObject>
  $ref?: string
  allOf?: ReadonlyArray<SchemaObject>
  anyOf?: ReadonlyArray<SchemaObject>
}

const skipIfUndefined = <T>(f: (v: T) => T): ((v: T | undefined) => T | undefined) => v =>
  v !== undefined ? f(v) : undefined

export function resolveNestedSchema(schema: SchemaObject): SchemaObject {
  const seen = new WeakSet()
  const propertySetMap = (schema: SchemaObject, resoleveFuncs: any): SchemaObject => {
    let copySchema = copyObject(schema)
    for (let k in schema) {
      if (resoleveFuncs[k]) {
        let result = resoleveFuncs[k](schema[k])
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
        dest[k] = source[k]
      }
      else {
        dest[k] = copyObject(source[k]);
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
      additionalProperties: skipIfUndefined(resolveNestedSchemaObject),
      items: skipIfUndefined(resolveNestedSchemaObject),
      allOf: resolveOptionalSchemaObjectArray,
      anyOf: resolveOptionalSchemaObjectArray,
      oneOf: resolveOptionalSchemaObjectArray
    })
    return result
  }

  return resolveSchemaObject(schema)
}
