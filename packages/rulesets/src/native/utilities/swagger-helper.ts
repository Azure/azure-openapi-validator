import $RefParser, { FileInfo } from "@apidevtools/json-schema-ref-parser"
import { ISwaggerInventory } from "@microsoft.azure/openapi-validator-core"
import _ from "lodash"
import { crwalReference, isExample } from "./ref-helper"

export class SwaggerHelper {
  constructor(private root?: any, private specPath?: string, private inventory?: ISwaggerInventory) {
  }
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

  private getDefinitionByName(modelName: string) {
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

  static isLocalRef(schema: any) {
    return schema.$ref && schema.$ref.startsWith("#/")
  }

  public async resolveSchema(schema: any, skipResolveExample = true) {
    if (!schema) {
      return schema
    }
    schema = _.cloneDeep(schema)

    if (SwaggerHelper.isLocalRef(schema)) {
      schema.$ref = this.specPath + schema.$ref
    }
    const inventory = this.inventory
    const resolveOption: $RefParser.Options = {
      resolve: {
        file: {
          canRead: true,
          read(file: FileInfo) {
            if (skipResolveExample && isExample(file.url)) {
              return {}
            }
            return _.cloneDeep(inventory?.getDocuments(file.url))
          }
        }
      }
    }
    return await $RefParser.dereference(schema, resolveOption)
  }
}
