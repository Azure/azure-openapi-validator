import { DocumentDependencyGraph } from "./depsGraph"
import { parseJsonRef } from "./document"
import { nodes, stringify } from "./jsonpath"

export class SwaggerUtils {
  private innerDoc: any
  private graph: DocumentDependencyGraph | undefined
  private specPath: string | undefined

  constructor(swagger: object, specPath?: string, graph?: DocumentDependencyGraph) {
    this.innerDoc = swagger
    this.graph = graph
    this.specPath = specPath
  }

  public getOperationIdFromPath(path: string, code = "get") {
    let pathObj = this.innerDoc.paths[path]
    if (!pathObj && this.innerDoc["x-ms-paths"]) {
      pathObj = this.innerDoc["x-ms-paths"][path]
    }
    if (pathObj && pathObj[code]) {
      return pathObj[code].operationId
    }
  }

  public getDefinitionByName(modelName: string) {
    if (!modelName) {
      return undefined
    }
    return this.innerDoc?.definitions[modelName]
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

  public getPropertyOfModel(sourceModel, propertyName: string) {
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
        const property = this.getPropertyOfModel(element, propertyName)
        if (property) {
          return property
        }
      }
    }
  }
  private getUnwrappedModel(property: any) {
    if (property) {
      return deReference(this.innerDoc, property, this.graph)
    }
  }
}
export function deReference(doc: any, schema: any, graph?: DocumentDependencyGraph) {
  const getRefModel = (refValue: string, visited: string[]) => {
    if (visited.includes(refValue)) {
      throw new Error("Found circle reference: " + visited.join("->"))
    }
    visited.push(refValue)
    const refSlices = parseJsonRef(refValue)
    const pathExpression = refSlices[1].split("/").slice(1)
    try {
      const result = nodes(doc, stringify(["$", ...pathExpression]))
      return result.length !== 0 ? result[0].value : undefined
    } catch (err) {
      throw err
    }
  }

  if (schema && doc) {
    if (schema.$ref) {
      const refSlices = parseJsonRef(schema.$ref)
      if (graph && refSlices[0]) {
        doc = graph.getDocument(refSlices[0])
      }
      schema = getRefModel(`#${refSlices[1]}`, [])
      return deReference(doc, schema, graph)
    }
    return schema
  }
  return undefined
}
