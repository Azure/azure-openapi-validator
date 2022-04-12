import $RefParser, { FileInfo } from "@apidevtools/json-schema-ref-parser"
import _ from "lodash"
import { crwalReference, isExample, traverse } from "./ref-helper"
import { ISwaggerInventory } from "@microsoft.azure/openapi-validator-core"

export class SwaggerHelper {
  private schemaCaches = new Map<string, any>()
  constructor(private root?: any, private specPath?: string, private inventory?: ISwaggerInventory) {}

  public getOperationIdFromPath(path: string, code = "get") {
    let pathObj = this.root.paths[path]
    if (!pathObj && this.root["x-ms-paths"]) {
      pathObj = this.root["x-ms-paths"][path]
    }
    if (pathObj && pathObj[code]) {
      return pathObj[code].operationId
    }
  }

  public getSpecPath() {
    return this.specPath
  }

  public getDefinitionByName(modelName: string) {
    if (!modelName) {
      return undefined
    }
    return this.root?.definitions?.[modelName]
  }

  /**
   * get property of model recursively, if not found return undefined
   */
  public getPropertyOfModelName(modelName: string, propertyName: string) {
    const model = this.getDefinitionByName(modelName)
    if (!model) {
      return undefined
    }
    return this.getPropertyOfModel(model, propertyName)
  }

  public getPropertyOfModel(sourceModel: any, propertyName: string):any {
    if (!sourceModel) {
      return undefined
    }
    let model = sourceModel
    if (sourceModel.$ref) {
      model = this.getUnwrappedModel(sourceModel)
    }
    if (!model) {
      return undefined
    }
    if (model.properties && model.properties[propertyName]) {
      return this.getUnwrappedModel(model.properties[propertyName])
    }
    if (model.allOf) {
      for (const element of model.allOf) {
        const property:any = this.getPropertyOfModel(element, propertyName)
        if (property) {
          return property
        }
      }
    }
  }

  private getUnwrappedModel(property: any) {
    if (property) {
      return crwalReference(this.root, property, this.inventory)
    }
  }

  private resolveExternalRef = async (ref: string) => {
    if (ref && this.schemaCaches.has(ref)) {
      return this.schemaCaches.get(ref)
    }
    const inventory = this.inventory
    const resolveOption: $RefParser.Options = {
      resolve: {
        file: {
          canRead: true,
          read(file: FileInfo) {
            if (isExample(file.url)) {
              return ""
            }
            return inventory?.getDocuments(file.url)
          }
        },
      },
      dereference:{
        circular: "ignore"
      }
    }
    const resolvedSchema = await $RefParser.dereference({ $ref: ref }, resolveOption)
    this.schemaCaches.set(ref, resolvedSchema)
    return resolvedSchema
  }

  static isExternalRef(schema: any) {
    return schema.$ref && !schema.$ref.startsWith("#/")
  }

  public getResolvedRef(ref: string) {
    return this.schemaCaches.get(ref)
  }

  public async resolveSchema(schema: any | string) {
    if (!schema) {
      return schema
    }

    if (SwaggerHelper.isExternalRef(schema)) {
      return await this.resolveExternalRef(schema.$ref)
    }

    if (typeof schema === "string") {
      schema = {
        $ref: schema
      }
    } else {
      schema = _.cloneDeep(schema)
    }

    const replace = (to: any, from: any) => {
      if (!to || !from) {
        return
      }
      delete to.$ref
      Object.entries(from).forEach(v => {
        to[v[0]] = v[1]
      })
    }

    const collectRefs = (schema: any) => {
      const refs = new Set<string>()
      traverse(schema, ["/"], new Set<string>(), {}, (current, path, ctx) => {
        if (SwaggerHelper.isExternalRef(current)) {
          refs.add(current.$ref)
          return false
        }
        return true
      })
      return Array.from(refs.values())
    }

    const promises = []
    for (const ref of collectRefs(schema)) {
      promises.push(this.resolveExternalRef(ref))
    }
    await Promise.all(promises)

    traverse(schema, ["/"], new Set<string>(), this, (current, path, ctx) => {
      if (SwaggerHelper.isExternalRef(current)) {
        const resolved = ctx.getResolvedRef(current.$ref)
        replace(current, resolved)
        return false
      }
      return true
    })
    return schema
  }
}
