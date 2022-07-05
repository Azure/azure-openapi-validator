import { JsonPath, ISwaggerInventory } from "@microsoft.azure/openapi-validator-core"
import { parseJsonRef } from "./ref-helper"

// workspace to manipulate schema which contains remote reference
export namespace Workspace {
  export type EnhancedSchema = {
    file: string
    value: any
  }

  export function getSchemaByName(modelName: string, swaggerPath: string, inventory: ISwaggerInventory) {
    const root = inventory.getDocuments(swaggerPath)
    if (!root || !modelName) {
      return undefined
    }
    return root?.definitions?.[modelName]
  }
  export function jsonPath(paths: JsonPath, document: any) {
    let root = document
    for (const seg of paths) {
      root = root[seg]
      if (!root) {
        break
      }
    }
    return root
  }

  export function resolveRef(schema: EnhancedSchema, inventory: ISwaggerInventory): EnhancedSchema | undefined {
    function getRef(refValue: string, swaggerPath: string) {
      const root = inventory.getDocuments(swaggerPath)
      if (refValue.startsWith("/")) {
        refValue = refValue.substring(1)
      }
      const segments = refValue.split("/")
      return jsonPath(segments, root)
    }
    let currentSpec = schema.file
    let currentSchema = schema.value
    while (currentSchema && currentSchema.$ref) {
      const slices = parseJsonRef(currentSchema.$ref)
      currentSpec = slices[0] || currentSpec
      currentSchema = getRef(slices[1], currentSpec)
    }
    return {
      file: currentSpec,
      value: currentSchema,
    }
  }

  export function getProperty(schema: EnhancedSchema, propertyName: string, inventory: ISwaggerInventory): EnhancedSchema | undefined {
    let source = schema
    const visited = new Set<any>()
    while (source.value && source.value.$ref && !visited.has(source.value)) {
      visited.add(source.value)
      source = resolveRef(source, inventory)!
    }
    if (!source || !source.value) {
      return undefined
    }
    const model = source.value
    if (model.properties && model.properties[propertyName]) {
      return resolveRef(createEnhancedSchema(model.properties[propertyName], source.file), inventory!)
    }
    if (model.allOf) {
      for (const element of model.allOf) {
        const property: any = getProperty({ file: source.file, value: element }, propertyName, inventory)
        if (property) {
          return property
        }
      }
    }
    return undefined
  }

  export function getAttribute(schema: EnhancedSchema, attributeName: string, inventory: ISwaggerInventory): EnhancedSchema | undefined {
    let source = schema
    const visited = new Set<any>()
    while (source.value && source.value.$ref && !visited.has(source.value)) {
      visited.add(source.value)
      source = resolveRef(source, inventory)!
    }
    if (!source) {
      return undefined
    }
    const attribute = source.value[attributeName]
    if (attribute) {
      return createEnhancedSchema(attribute, source.file)
    }
    return undefined
  }

  export function createEnhancedSchema(schema: any, specPath: string) {
    return {
      file: specPath,
      value: schema,
    }
  }
}
