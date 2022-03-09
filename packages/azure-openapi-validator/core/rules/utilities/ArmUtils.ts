/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ISwaggerHelper } from "../.."
import { nodes } from "../../jsonpath"
import { SwaggerUtils } from "../../swaggerUtils"
import { IDocumentDependencyGraph } from "../../types"

export interface CollectionApiInfo {
  modelName: string
  childModelName: string
  collectionGetPath: string[]
  specificGetPath: string[]
}

function* jsonPathIt(doc, jsonPath: string): Iterable<any> {
  if (doc) {
    for (const node of nodes(doc, jsonPath)) {
      yield node.value
    }
  }
}

function addToMap(map: Map<string, string[]>, key: string, value: string) {
  if (map.has(key)) {
    map.set(key, map.get(key).concat(value))
  } else {
    map.set(key, [value])
  }
}

/**
 * this class only handle swagger without external refs, as the linter's input is a external-refs-resolved swagger
 */
export class ArmUtils {
  private BaseResourceModelNames = ["trackedresource", "proxyresource", "resource", "azureentityresource"]

  private ResourceGroupWideResourceRegEx = new RegExp("^/subscriptions/{[^/]+}/resourceGroups/{[^/]+}/", "gi")

  private SubscriptionsWideResourceRegEx = new RegExp("^/subscriptions/{[^/]+}/providers/", "gi")

  private OperationApiRegEx = new RegExp("^/providers/[^/]+/operations$", "gi")

  private SpecificResourcePathRegEx = new RegExp("/providers/[^/]+(/\\w+/{[^/}]+})+$", "gi")

  private XmsResources = new Set<string>()
  private swaggerUtil: ISwaggerHelper

  constructor(private innerDoc: any, private specPath?: string, private graph?: IDocumentDependencyGraph) {
    this.getXmsResources()
    this.swaggerUtil = new SwaggerUtils(this.innerDoc, this.specPath, this.graph)
  }

  private getSpecificOperationModels(httpMethod, code) {
    const models: Map<string, string[]> = new Map<string, string[]>()
    const getModel = node => {
      if (node && node.value) {
        const response = node.value
        if (response.schema && response.schema.$ref) {
          const modelName = this.stripDefinitionPath(response.schema.$ref)
          if (modelName) {
            addToMap(models, modelName, node.path[2] as string)
          }
        }
      }
    }
    for (const node of nodes(this.innerDoc, `$.paths.*.${httpMethod}.responses.${code}`)) {
      getModel(node)
    }
    for (const node of nodes(this.innerDoc, `$['x-ms-paths'].*.${httpMethod}.responses.${code}`)) {
      getModel(node)
    }
    return models
  }

  private getXmsResources() {
    for (const node of nodes(this.innerDoc, `$.definitions.*`)) {
      const model = node.value
      for (const extension of jsonPathIt(model, `$..['x-ms-azure-resource']`)) {
        if (extension === true) {
          this.XmsResources.add(node.path[2] as string)
        }
      }
    }
  }

  public getResourceByName(modelName: string) {
    if (!modelName) {
      return undefined
    }
    /*if (!this.innerDoc?.definitions || this.innerDoc.definitions[modelName]) {
      const doc = this.graph.getDocument(this.specPath)
      doc.getReferences()
    }*/
    return this.innerDoc?.definitions?.[modelName]
  }

  /**
   * @param modelName
   *  instructions:
   *  1 if it's a x-ms-resource
   *  2 if it's allOfing a x-ms-azure-resource or base resource
   *  3 if it contains allOf, check the allOf resource recursively
   */
  private checkResource(modelName: string) {
    const model = this.getResourceByName(modelName)
    if (!model) {
      return false
    }
    if (this.XmsResources.has(modelName)) {
      return true
    }
    for (const refs of jsonPathIt(model, `$.allOf`)) {
      for (const ref of refs) {
        const refPoint = ref.$ref
        const subModel = this.stripDefinitionPath(refPoint)
        if (!subModel) {
          continue
        }
        if (this.BaseResourceModelNames.indexOf(subModel.toLowerCase()) !== -1) {
          return true
        }
        if (this.XmsResources.has(subModel)) {
          return true
        }
        if (this.checkResource(subModel)) {
          return true
        }
      }
    }
    return false
  }

  public stripDefinitionPath(reference: string) {
    const refPrefix = "#/definitions/"
    if (!reference) {
      return undefined
    }
    const index = reference.indexOf(refPrefix)
    if (index !== -1) {
      return reference.substr(index + refPrefix.length)
    }
  }

  /**
   *  Get all resources which allOf a x-ms-resource
   */
  public getAllResourcesFromDefinitions() {
    if (!this.innerDoc.definitions) {
      return []
    }
    const keys = Object.keys(this.innerDoc.definitions as object)
    const AllResources = keys.reduce((pre, cur) => {
      if (this.getResourceHierarchy(cur).some(model => this.checkResource(model))) {
        return [...pre, cur]
      } else {
        return pre
      }
    }, [])
    return AllResources
  }

  public getAllOperationGetResponseModels() {
    return this.getSpecificOperationModels("get", "200")
  }

  private getOperationGetResponseResources() {
    const models = [...this.getAllOperationGetResponseModels().entries()].filter(m => this.checkResource(m[0]))
    return new Map(models)
  }

  // from paths
  public getAllResourceNames() {
    const modelNames = [
      ...this.getSpecificOperationModels("get", "200").keys(),
      ...this.getSpecificOperationModels("put", "200").keys(),
      ...this.getSpecificOperationModels("put", "201").keys()
    ]
    return modelNames.filter(m => this.checkResource(m))
  }

  public getAllNestedResources() {
    const fullModels = this.getOperationGetResponseResources()
    const nestedModels = new Set<string>()
    for (const entry of fullModels.entries()) {
      const paths = entry[1]
      paths
        /* some paths not begin with /subscriptions/, they should be ignored */
        .filter(p => p.toLowerCase().startsWith("/subscriptions/"))
        .some(p => {
          const hierarchy = this.getResourcesTypeHierarchy(p)
          if (hierarchy.length > 1) {
            nestedModels.add(entry[0])
            return true
          }
        })
    }
    return nestedModels
  }

  /**
   * Check the following conditions , to decide if a model can be considered as a top-level resource
   * 1 when a model existing in a get/put operation and 200/201 response, consider as a resource
   * 2 when the path match the pattern: /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/expressRouteCircuits/{circuitName}
   * 3 filter tenant wide resource
   */
  public getAllTopLevelResources() {
    const fullModels = this.getOperationGetResponseResources()
    const topLevelModels = new Set<string>()
    for (const entry of fullModels.entries()) {
      const paths = entry[1]
      paths
        .filter(p => p.toLowerCase().startsWith("/subscriptions/"))
        .some(p => {
          const hierarchy = this.getResourcesTypeHierarchy(p)
          if (hierarchy.length === 1) {
            topLevelModels.add(entry[0])
            return true
          }
        })
    }
    return topLevelModels
  }

  public getTopLevelResourcesByRG() {
    const fullModels = this.getOperationGetResponseResources()
    const topLevelModels = new Set<string>()
    for (const entry of fullModels.entries()) {
      const paths = entry[1]
      paths
        .filter(p => this.isPathByResourceGroup(p))
        .some(p => {
          const hierarchy = this.getResourcesTypeHierarchy(p)
          if (hierarchy.length === 1) {
            topLevelModels.add(entry[0])
            return true
          }
        })
    }
    return topLevelModels
  }

  public getAllResource() {
    const fullModels = this.getOperationGetResponseResources()
    const resources = new Set<string>()
    for (const entry of fullModels.entries()) {
      const paths = entry[1]
      paths.some(p => {
        const hierarchy = this.getResourcesTypeHierarchy(p)
        if (hierarchy.length > 0) {
          resources.add(entry[0])
          return true
        }
      })
    }
    return resources.values()
  }

  /**
   *
   * @param path
   * case 1 : '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/applicationGateways'
   * return ["applicationGateways"]
   * case 2: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/expressRouteCircuits/{circuitName}/peerings/{peeringName}'
   * return ["expressRouteCircuits","peerings"]
   * instructions:
   *  1  regex match -> 'expressRouteCircuits/{circuitName}/peerings/{peeringName}' -> get first resource type :expressRouteCircuits
   *  2  substr -> '/peerings/{peeringName}' -> get second resource
   *  3  loop in step 2 until break condition
   */
  private getResourcesTypeHierarchy(path: string) {
    const index = path.lastIndexOf("/providers/")
    if (index === -1) {
      return []
    }
    const lastProvider = path.substr(index)
    const result = []
    const matches = lastProvider.match(this.SpecificResourcePathRegEx)
    if (matches && matches.length) {
      let match = matches[0]
      while (match.indexOf("/{") !== -1) {
        result.push(match.substr(1, match.indexOf("/{") - 1))
        if (match.indexOf("}/") !== -1) {
          match = match.substr(match.indexOf("}/") + 1)
        } else {
          match = ""
        }
      }
    }
    return result
  }

  /**
   * hierarchy base on keyword:allOf
   * @param modelName
   */
  private getResourceHierarchy(modelName: string) {
    let hierarchy = []
    const model = this.getResourceByName(modelName)
    if (!model) {
      return hierarchy
    }
    for (const refs of jsonPathIt(model, `$.allOf`)) {
      refs
        .filter(ref => !!ref.$ref)
        .forEach(ref => {
          const allOfModel = this.stripDefinitionPath(ref.$ref)
          hierarchy.push(allOfModel)
          hierarchy = hierarchy.concat(this.getResourceHierarchy(allOfModel))
        })
    }
    return hierarchy
  }

  public containsDiscriminator(modelName: string) {
    const hierarchy = this.getResourceHierarchy(modelName)
    return hierarchy.some(h => {
      const resource = this.getResourceByName(h)
      return resource && resource.discriminator
    })
  }

  /**
   * return [{operationPath}:{schema}]
   */

  public getOperationApi() {
    for (const pathNode of nodes(this.innerDoc, "$.paths.*")) {
      const path = pathNode.path[2] as string
      const matchResult = path.match(this.OperationApiRegEx)
      if (matchResult) {
        return [path, this.stripDefinitionPath(pathNode.value?.get?.responses["200"]?.schema?.$ref)]
      }
    }
    return undefined
  }

  /**
   * get a model and its collection api path mapping
   *      Case 1: /subscriptions/{subscriptionId}/resourceGroup/{resourceGroupName}/providers/Microsoft.Sql/servers/{server1}
   *      Case 2: /subscriptions/{subscriptionId}/resourceGroup/{resourceGroupName}/providers/Microsoft.Sql/servers
   * if case 1 and case 2 both existing , consider case 2 is collection api.
   */

  public getCollectionApiInfo() {
    let allPathKeys = this.innerDoc.paths ? Object.keys(this.innerDoc.paths) : []
    if (this.innerDoc["x-ms-paths"]) {
      allPathKeys = allPathKeys.concat(Object.keys(this.innerDoc["x-ms-paths"]))
    }
    const modelMapping = this.getOperationGetResponseResources()
    const getOperationModels = this.getAllOperationGetResponseModels()
    const collectionApis: CollectionApiInfo[] = []
    for (const modelEntry of modelMapping.entries()) {
      if (!getOperationModels.has(modelEntry[0])) {
        continue
      }
      modelEntry[1].forEach(path => {
        if (path.match(this.SpecificResourcePathRegEx)) {
          const firstProviderIndex = path.lastIndexOf("/providers")
          const lastIndex = path.lastIndexOf("/{")
          const possibleCollectionApiPath = path.substr(firstProviderIndex, lastIndex - firstProviderIndex)
          /*
          * case 1:"providers/Microsoft.Compute/virtualMachineScaleSets/{virtualMachineScaleSetName}/virtualMachines"
            case 2: "providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}/virtualMachines":
            case 1 and case 2 should be the same, as the difference of parameter name does not have impact
          */
          const matchedPaths = allPathKeys.filter(
            /**
             * path may end with "/", so here we remove it
             */
            p =>
              p
                .substr(p.lastIndexOf("/providers"))
                .replace(/{[^\/]+}/gi, "{}")
                .replace(/\/$/gi, "") === possibleCollectionApiPath.replace(/{[^\/]+}/gi, "{}")
          )
          if (matchedPaths && matchedPaths.length >= 1) {
            collectionApis.push({
              specificGetPath: [path],
              collectionGetPath: matchedPaths,
              modelName: this.getModelFromPath(matchedPaths[0]),
              childModelName: modelEntry[0]
            })
          }
        }
      })
    }
    /**
     * if a resource definition does match a collection resource schema, we can back-stepping the corresponding operation to make sure
     * we don't lost it
     */
    const collectionResources = this.getCollectionResources()
    for (const resource of collectionResources) {
      if (getOperationModels.has(resource[1])) {
        const index = collectionApis.findIndex(e => e.modelName === resource[1])
        const collectionInfo = {
          specificGetPath: getOperationModels.get(resource[0]),
          collectionGetPath: getOperationModels.get(resource[1]),
          modelName: resource[1],
          childModelName: resource[0]
        }
        if (index === -1) {
          collectionApis.push(collectionInfo)
        }
      }
    }

    return collectionApis
  }

  /**
   * get collection resource from definition by finding the models which satisfy the conditions:
   * 1 type == array
   * 2 its items refers one of resources definition
   */
  public getCollectionResources() {
    const resourceModel = this.getOperationGetResponseResources()
    const resourceCollectMap = new Map<string, string>()
    const doc = this.innerDoc
    for (const resourceNode of nodes(doc, "$.definitions.*")) {
      for (const arrayNode of nodes(resourceNode.value, "$..[?(@property === 'type' && @ === 'array')]^")) {
        const arrayObj = arrayNode.value
        const items = arrayObj?.items
        if (
          items &&
          items.$ref &&
          resourceModel.has(this.stripDefinitionPath(items.$ref)) &&
          arrayNode.path.length === 3 &&
          arrayNode.path[1] === "properties" &&
          arrayNode.path[2] === "value"
        ) {
          resourceCollectMap.set(this.stripDefinitionPath(items.$ref), resourceNode.path[2] as string)
        }
      }
    }
    return resourceCollectMap
  }

  public getCollectionModels() {
    const collectionModels = new Map<string, string>()
    const doc = this.innerDoc
    const allResources = this.getAllResourcesFromDefinitions()

    for (const resourceNode of nodes(doc, "$.definitions.*")) {
      for (const arrayNode of nodes(resourceNode.value, "$..[?(@property === 'type' && @ === 'array')]^")) {
        const arrayObj = arrayNode.value
        const items = arrayObj?.items
        if (items && items.$ref) {
          const itemsModel = this.stripDefinitionPath(items.$ref)
          if (allResources.indexOf(itemsModel) !== -1) {
            collectionModels.set(resourceNode.path[2] as string, this.stripDefinitionPath(items.$ref))
          }
        }
      }
    }
    return collectionModels
  }

  public isPathBySubscription(path: string) {
    return !!path.match(this.SubscriptionsWideResourceRegEx)
  }

  public isPathByResourceGroup(path: string) {
    return !!path.match(this.ResourceGroupWideResourceRegEx)
  }

  /**
   *
   * @param path
   * @returns model definitions name or undefined if the model is anonymous
   */
  public getModelFromPath(path: string) {
    let pathObj = this.innerDoc.paths[path]
    if (!pathObj && this.innerDoc["x-ms-paths"]) {
      pathObj = this.innerDoc["x-ms-paths"][path]
    }
    if (pathObj && pathObj.get && pathObj.get.responses["200"]) {
      return this.stripDefinitionPath(pathObj.get.responses["200"]?.schema?.$ref)
    }
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

  /**
   *
   * @param collectionModel
   * @param childModelName
   *
   * case 1: value : {
   *  type:array,
   *  items:{
   *    "refs":"#/definitions/"
   *  }
   * }
   */
  public verifyCollectionModel(collectionModel, childModelName: string) {
    if (collectionModel) {
      if (collectionModel.type === "array" && collectionModel.items) {
        const itemsRef = collectionModel.items.$ref
        if (this.stripDefinitionPath(itemsRef) === childModelName) {
          return true
        }
      }
    }
  }

  public getPropertyOfModel(schema: any, property: string) {
    return this.swaggerUtil.getPropertyOfModel(schema, property)
  }

  public getPropertyOfModelName(modelName: string, propertyName: string) {
    return this.swaggerUtil.getPropertyOfModelName(modelName, propertyName)
  }
}
