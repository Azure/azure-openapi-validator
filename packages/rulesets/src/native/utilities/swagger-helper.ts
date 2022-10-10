import $RefParser, { FileInfo } from "@apidevtools/json-schema-ref-parser"
import { ISwaggerInventory } from "@microsoft.azure/openapi-validator-core"
import _ from "lodash"
import { isExample } from "./ref-helper"
import { Workspace } from "./swagger-workspace"

export class SwaggerHelper {
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

  public getProperty(sourceModel: Workspace.EnhancedSchema, propertyName: string): any {
    if (!sourceModel) {
      return undefined
    }
    return Workspace.getProperty(sourceModel, propertyName, this.inventory!)
  }

  public resolveRef(sourceModel: Workspace.EnhancedSchema): any {
    if (!sourceModel) {
      return undefined
    }
    return Workspace.resolveRef(sourceModel, this.inventory!)
  }

  public getAttribute(sourceModel: Workspace.EnhancedSchema, attributeName: string) {
    if (!sourceModel) {
      return undefined
    }
    return Workspace.getAttribute(sourceModel, attributeName, this.inventory!)
  }

  public async resolveSchema(schema: any, skipResolveExample = true) {
    if (!schema) {
      return schema
    }
    schema = _.cloneDeep(schema)

    function isLocalRef(schema: any) {
      return schema.$ref && schema.$ref.startsWith("#/")
    }

    if (isLocalRef(schema)) {
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
          },
        },
      },
    }
    return await $RefParser.dereference(schema, resolveOption)
  }
}
