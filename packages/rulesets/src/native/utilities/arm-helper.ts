/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ISwaggerInventory, parseJsonRef } from "@microsoft.azure/openapi-validator-core"
import _ from "lodash"
import { nodes } from "./jsonpath"
import { SwaggerHelper } from "./swagger-helper"
import { SwaggerWalker } from "./swagger-walker"
import { Workspace } from "./swagger-workspace"

export interface CollectionApiInfo {
  modelName: string
  childModelName: string
  collectionGetPath: string[]
  specificGetPath: string[]
}

type Operation = {
  specPath: string
  apiPath: string
  httpMethod: string
  operationId: string
  requestBodyParameter?: any
  requestParameters?: any[]
  responseSchema: any
}

type ResourceInfo = {
  modelName: string
  specPath: string
  resourceType?: string
  operations: Operation[]
}

function* jsonPathIt(doc: any, jsonPath: string): Iterable<any> {
  if (doc) {
    for (const node of nodes(doc, jsonPath)) {
      yield node.value
    }
  }
}

/**
 * this class only handle swagger without external refs
 */
export class ArmHelper {
  private BaseResourceModelNames = ["trackedresource", "proxyresource", "resource", "azureentityresource"]

  private ResourceGroupWideResourceRegEx = new RegExp("^/subscriptions/{[^/]+}/resourceGroups/{[^/]+}/", "gi")

  private SubscriptionsWideResourceRegEx = new RegExp("^/subscriptions/{[^/]+}/providers/", "gi")

  private OperationApiRegEx = new RegExp("^/providers/[^/]+/operations$", "gi")

  private SpecificResourcePathRegEx = new RegExp("/providers/[^/]+(?:/\\w+/default|/\\w+/{[^/]+})+$", "gi")

  private ExtensionResourceReg = new RegExp(".+/providers/.+/providers/.+$", "gi")
  //  resource model with 'x-ms-resource' or allOfing 'Resource' or 'TrackedResource' for ProxyResource
  private XmsResources = new Set<string>()
  resources: ResourceInfo[] = []
  armResources: ResourceInfo[] | undefined
  private swaggerUtil: SwaggerHelper

  constructor(private innerDoc: any, private specPath: string, private inventory: ISwaggerInventory) {
    this.swaggerUtil = new SwaggerHelper(this.innerDoc, this.specPath, this.inventory)
    this.getXmsResources()
    this.getAllResources()
  }

  private getBodyParameter(parameters: any) {
    let bodyParameter
    if (parameters && Array.isArray(parameters)) {
      parameters.forEach((param: any) => {
        if (param.$ref) {
          const resolvedParam = this.swaggerUtil.resolveRef(this.enhancedSchema(param))
          if (resolvedParam && resolvedParam.value && resolvedParam.value.in === "body") {
            bodyParameter = this.enhancedSchema(resolvedParam.value.schema, resolvedParam.file)
          }
        }
      })
    }

    return bodyParameter
  }

  private populateOperations(doc: any, specPath: string) {
    const paths = { ...(doc.paths || {}), ...(doc["x-ms-paths"] || {}) }
    const operations: Operation[] = []
    for (const [key, value] of Object.entries(paths)) {
      for (const [method, operation] of Object.entries(value as any)) {
        if (method !== "parameters") {
          const op = operation as any
          const response = op?.responses?.["200"] || op?.responses?.["201"]
          const requestBodyParameter = this.getBodyParameter(op.parameters)
          if (response) {
            operations.push({
              specPath,
              apiPath: key,
              httpMethod: method,
              requestBodyParameter,
              responseSchema: response.schema,
              operationId: op?.operationId,
            })
          }
        }
      }
    }
    return operations
  }

  private populateResources(doc: any, specPath: string) {
    const operations = this.populateOperations(doc, specPath)
    for (const op of operations) {
      const resourceInfo = this.extractResourceInfo(op.responseSchema, specPath)
      // if no response or response with no $ref , it's deemed not a resource
      if (resourceInfo) {
        const existing = this.resources.find((re) => re.modelName === resourceInfo.modelName && re.specPath === resourceInfo.specPath)
        if (existing) {
          existing.operations.push(op)
        } else {
          this.resources.push({
            ...resourceInfo,
            operations: [op],
          })
        }
      }
    }
  }

  private getXmsResources() {
    for (const name of Object.keys(this.innerDoc.definitions || {})) {
      const model = this.getResourceByName(name)
      for (const extension of jsonPathIt(model?.value, `$..['x-ms-azure-resource']`)) {
        if (extension === true) {
          this.XmsResources.add(name as string)
          break
        }
      }
      if (this.checkResource(name)) {
        this.XmsResources.add(name)
      }
    }
    let resources = this.getAllOfResources()
    while (resources && resources.length) {
      resources.forEach((re) => this.XmsResources.add(re))
      resources = this.getAllOfResources()
    }
  }

  /**
   *  Get all resources which allOf a x-ms-azure-resource
   */
  private getAllOfResources() {
    if (!this.innerDoc.definitions) {
      return []
    }
    const keys = Object.keys(this.innerDoc.definitions || {}).filter((key) => !this.XmsResources.has(key))
    const AllResources = keys.reduce((pre, cur) => {
      if (this.getResourceHierarchy(cur).some((model) => this.checkResource(model))) {
        return [...pre, cur]
      } else {
        return pre
      }
    }, [])
    return AllResources
  }

  public getResourceByName(modelName: string) {
    if (!modelName) {
      return undefined
    }
    return Workspace.createEnhancedSchema(this.innerDoc?.definitions?.[modelName], this.specPath!)
  }

  /**
   * @param modelName
   *  instructions:
   *  1 if it's a x-ms-resource
   *  2 if its name match any base resource name
   */
  private checkResource(modelName: string) {
    if (this.BaseResourceModelNames.includes(modelName.toLowerCase())) {
      return true
    }
    if (this.XmsResources.has(modelName)) {
      return true
    }
    return false
  }

  public stripDefinitionPath(reference: string | undefined) {
    const refPrefix = "#/definitions/"
    if (!reference) {
      return undefined
    }
    const index = reference.indexOf(refPrefix)
    if (index !== -1) {
      return reference.substr(index + refPrefix.length)
    }
    return undefined
  }

  private extractResourceInfo(schema: any, specPath?: string) {
    if (schema && schema.$ref) {
      const segments = parseJsonRef(schema.$ref)
      return {
        specPath: segments[0] || specPath || this.specPath,
        modelName: this.stripDefinitionPath("#" + segments[1])!,
      }
    }
    return undefined
  }

  public getAllNestedResources() {
    const fullResources = this.getAllResources()
    const nestedResource = new Set<string>()
    for (const re of fullResources) {
      const operations = re.operations
      operations
        .filter((op) => op.apiPath.toLowerCase().startsWith("/subscriptions/"))
        .some((op) => {
          const hierarchy = this.getResourcesTypeHierarchy(op.apiPath)
          if (hierarchy.length > 1) {
            nestedResource.add(re.modelName)
            return true
          }
          return false
        })
    }
    return Array.from(nestedResource.values())
  }

  public getTopLevelResources() {
    const fullResources = this.getAllResources()
    return fullResources.filter((re) =>
      re.operations.some((op) => {
        const hierarchy = this.getResourcesTypeHierarchy(op.apiPath)
        if (hierarchy.length === 1 && !this.isPathOfExtensionResource(op.apiPath)) {
          return true
        }
        return false
      })
    )
  }

  public getTopLevelResourceNames() {
    return _.uniq(Array.from(this.getTopLevelResources().map((re) => re.modelName)))
  }

  public getTopLevelResourcesByRG() {
    return _.uniq(
      Array.from(
        this.getTopLevelResources()
          .filter((re) => re.operations.some((op) => this.isPathByResourceGroup(op.apiPath)))
          .map((re) => re.modelName)
      )
    )
  }

  public getAllResources() {
    if (this.armResources) {
      return this.armResources
    }
    this.populateResources(this.innerDoc, this.specPath)
    const references = this.inventory.referencesOf(this.specPath)
    for (const [specPath, reference] of Object.entries(references)) {
      this.populateResources(reference, specPath)
    }
    const localResourceModels = this.resources.filter((re) => re.specPath === this.specPath)
    const resWithXmsRes = localResourceModels.filter(
      (re) => this.XmsResources.has(re.modelName) && !this.BaseResourceModelNames.includes(re.modelName.toLowerCase())
    )
    const resWithPutOrPath = localResourceModels.filter((re) =>
      re.operations.some((op) => op.httpMethod === "put" || op.httpMethod == "patch")
    )
    const reWithPostOnly = resWithXmsRes.filter((re) => re.operations.every((op) => op.httpMethod === "post"))

    //  remove the resource only return by post , and add the resources return by put or patch
    this.armResources = _.uniqWith(
      resWithXmsRes.filter((re) => !reWithPostOnly.some((re1) => re1.modelName === re.modelName)).concat(resWithPutOrPath),
      _.isEqual
    )
    return this.armResources
  }

  public getTrackedResources() {
    const isTrackedResource = (schema: any) => {
      const enhancedSchema = this.enhancedSchema(schema)
      return !!this.getProperty(enhancedSchema, "location")
    }
    const allTrackedResources = this.getAllResources().filter((re) => {
      const schema = re.operations.find((op) => op.responseSchema)
      if (schema) {
        return isTrackedResource(schema.responseSchema)
      }
      return false
    })
    return allTrackedResources
  }

  public getAllResourceNames() {
    const fullResources = this.getAllResources()
    const resources = new Set<string>()
    for (const re of fullResources) {
      const operations = re.operations
      operations.some((op) => {
        const hierarchy = this.getResourcesTypeHierarchy(op.apiPath)
        if (hierarchy.length > 0) {
          resources.add(re.modelName)
          return true
        }
        return false
      })
    }
    return [...resources.values()]
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
      const match = matches[0]
      const segments = match.split("/").slice(3)
      for (const segment of segments) {
        if (segment.startsWith("{") || segment === "default") {
          continue
        }
        result.push(segment)
      }
    }
    return result
  }

  /**
   * hierarchy base on keyword:allOf
   * @param modelName
   */
  private getResourceHierarchy(model: string | Workspace.EnhancedSchema) {
    let hierarchy: string[] = []
    const enhancedModel: Workspace.EnhancedSchema = typeof model === "string" ? this.getResourceByName(model)! : model

    if (!enhancedModel) {
      return hierarchy
    }
    const unwrappedSchema = Workspace.resolveRef(enhancedModel, this.inventory)!
    for (const refs of jsonPathIt(unwrappedSchema.value, `$.allOf`)) {
      refs
        .filter((ref: any) => !!ref.$ref)
        .forEach((ref: any) => {
          const allOfModel = this.stripDefinitionPath(ref.$ref)
          if (allOfModel) {
            hierarchy.push(allOfModel)
            hierarchy = hierarchy.concat(this.getResourceHierarchy(this.enhancedSchema(ref, unwrappedSchema.file)))
          }
        })
    }
    return hierarchy
  }

  private containsDiscriminatorInternal(model: Workspace.EnhancedSchema) {
    if (model) {
      const unWrappedModel = Workspace.resolveRef(model, this.inventory)
      if (unWrappedModel?.value && unWrappedModel?.value.allOf) {
        for (const ref of unWrappedModel.value.allOf) {
          const unWrappedRef = Workspace.resolveRef(this.enhancedSchema(ref), this.inventory)
          if (unWrappedRef?.value?.discriminator || (unWrappedRef && this.containsDiscriminatorInternal(unWrappedRef))) {
            return true
          }
        }
      }
    }
    return false
  }

  public containsDiscriminator(modelName: string) {
    let model
    if (typeof modelName === "string") {
      model = this.getResourceByName(modelName)
    }
    if (model) {
      return this.containsDiscriminatorInternal(model)
    }
    return false
  }

  /**
   * Return the schema for 200 response for GET /providers/.../operations if it exists
   * return [{operationPath}:{Workspace.EnhancedSchema}]
   */
  public getOperationApi() {
    const walker = new SwaggerWalker(this.inventory)
    let result: any = undefined
    walker.warkAll(["$.[paths,x-ms-paths].*"], (path: string[], value: any, rootPath: string) => {
      const apiPath = path[2] as string
      const matchResult = apiPath.match(this.OperationApiRegEx)
      if (matchResult) {
        result = [path, this.enhancedSchema(value?.get?.responses["200"]?.schema, rootPath)]
      }
    })
    return result
  }

  public resourcesWithGetOperations() {
    return this.resources.filter((re) => re.operations.some((op) => op.httpMethod === "get"))
  }

  public resourcesWithPutPatchOperations() {
    return this.armResources?.filter((re) => re.operations.some((op) => op.httpMethod === "put" || op.httpMethod == "patch")) || []
  }

  /**
   * get a model and its collection api path mapping
   *      Case 1: /subscriptions/{subscriptionId}/resourceGroup/{resourceGroupName}/providers/Microsoft.Sql/servers/{server1}
   *      Case 2: /subscriptions/{subscriptionId}/resourceGroup/{resourceGroupName}/providers/Microsoft.Sql/servers
   * if case 1 and case 2 both existing , consider case 2 is collection api.
   */

  public getCollectionApiInfo() {
    const getOperationModels = this.resourcesWithGetOperations()

    const allPathKeys = _.uniq(_.flattenDeep(this.resources.map((re) => re.operations.map((op) => op.apiPath))))

    const getResourcePaths = (res: ResourceInfo[], name: string) =>
      _.flattenDeep(res.filter((re) => re.modelName === name).map((re) => re.operations.map((op) => op.apiPath)))

    const collectionApis: CollectionApiInfo[] = []
    for (const re of getOperationModels) {
      re.operations.forEach((op) => {
        const path = op.apiPath
        if (collectionApis.find((re) => re.specificGetPath[0] === path)) {
          return
        }
        if (path.match(this.SpecificResourcePathRegEx)) {
          const firstProviderIndex = path.lastIndexOf("/providers")
          const lastIndex = path.lastIndexOf("/")
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
            (p) =>
              p
                .substr(p.lastIndexOf("/providers"))
                .replace(/{[^/]+}/gi, "{}")
                .replace(/\/$/gi, "") === possibleCollectionApiPath.replace(/{[^/]+}/gi, "{}")
          )
          if (matchedPaths && matchedPaths.length >= 1 && this.getOperationIdFromPath(matchedPaths[0])) {
            collectionApis.push({
              specificGetPath: [path],
              collectionGetPath: matchedPaths,
              modelName: this.getResponseModelNameFromPath(matchedPaths[0])!,
              childModelName: re.modelName,
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
      if (getOperationModels.some((re) => re.modelName === resource[1])) {
        const index = collectionApis.findIndex((e) => e.modelName === resource[1])
        const collectionInfo = {
          specificGetPath: getResourcePaths(getOperationModels, resource[0]) || [],
          collectionGetPath: getResourcePaths(getOperationModels, resource[1]) || [],
          modelName: resource[1],
          childModelName: resource[0],
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
    const resourceModel = this.resourcesWithGetOperations()
    const resourceCollectMap = new Map<string, string>()
    const doc = this.innerDoc
    for (const resourceNode of nodes(doc, "$.definitions.*")) {
      for (const arrayNode of nodes(resourceNode.value, "$..[?(@property === 'type' && @ === 'array')]^")) {
        const arrayObj = arrayNode.value
        const items = arrayObj?.items
        const res = this.stripDefinitionPath(items?.$ref)
        if (
          res &&
          resourceModel.some((re) => re.modelName === res) &&
          arrayNode.path.length === 3 &&
          arrayNode.path[1] === "properties" &&
          arrayNode.path[2] === "value"
        ) {
          resourceCollectMap.set(res, resourceNode.path[2] as string)
        }
      }
    }
    return resourceCollectMap
  }

  public getCollectionModels() {
    const collectionModels = new Map<string, string>()
    const doc = this.innerDoc
    const allResources = [...this.XmsResources.keys()]

    for (const resourceNode of nodes(doc, "$.definitions.*")) {
      for (const arrayNode of nodes(resourceNode.value, "$..[?(@property === 'type' && @ === 'array')]^")) {
        const arrayObj = arrayNode.value
        const items = arrayObj?.items
        if (items && items.$ref) {
          const itemsModel = this.stripDefinitionPath(items.$ref)
          if (itemsModel && allResources.indexOf(itemsModel) !== -1) {
            collectionModels.set(resourceNode.path[2] as string, itemsModel)
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

  public isPathOfExtensionResource(path: string) {
    return !!path.match(this.ExtensionResourceReg)
  }

  /**
   *
   * @param path
   * @returns response model or undefined if the model is anonymous
   */
  public getResponseModelFromPath(path: string): Workspace.EnhancedSchema | undefined {
    const getOperation = this.getOperation(path)
    if (getOperation && getOperation.responses["200"]) {
      return this.enhancedSchema(getOperation.responses?.["200"]?.schema)
    }
    return undefined
  }

  /**
   *
   * @param path
   * @returns model definitions name or undefined if the model is anonymous
   */
  public getResponseModelNameFromPath(path: string) {
    const re = this.resources.find((re) => re.operations.some((op) => op.apiPath === path))
    if (re) {
      return re.modelName
    }
    return undefined
  }

  public getOperation(path: string, code = "get", doc?: any) {
    let pathObj: any
    if (doc) {
      pathObj = doc.paths?.[path]
    } else {
      const walker = new SwaggerWalker(this.inventory)
      walker.warkAll([`$.[paths,x-ms-paths][${path}]`], (path: string[], value: any, rootPath: string) => {
        pathObj = value
      })
    }

    if (pathObj && pathObj[code]) {
      return pathObj[code]
    }
    return undefined
  }

  public getOperationIdFromPath(path: string, code = "get", doc?: any) {
    const operation = this.getOperation(path, code, doc)
    return operation?.operationId
  }

  public isPathXmsPageable(path: string, code = "get", doc?: any) {
    const operation = this.getOperation(path, code, doc)
    return !!operation?.["x-ms-pageable"]
  }

  public findOperation(path: string, code = "get") {
    const op = this.getOperationIdFromPath(path, code, this.innerDoc)
    if (op) {
      return op
    }
    const references = this.inventory.referencesOf(this.specPath)
    for (const reference of Object.values(references)) {
      const op = this.getOperationIdFromPath(path, code, reference)
      if (op) {
        return op
      }
    }
    return undefined
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
  public verifyCollectionModel(collectionModel: any, childModelName: string) {
    if (collectionModel) {
      if (collectionModel.type === "array" && collectionModel.items) {
        const itemsRef = collectionModel.items.$ref
        if (this.stripDefinitionPath(itemsRef) === childModelName) {
          return true
        }
      }
    }
    return false
  }

  public getProperty(schema: Workspace.EnhancedSchema, property: string): Workspace.EnhancedSchema {
    return this.swaggerUtil.getProperty(schema, property)
  }

  public getResourceProperties(resourceName: string) {
    const schema = this.getResourceByName(resourceName)
    if (schema) {
      return this.getProperties(schema)
    }
    return []
  }

  public getProperties(schema: Workspace.EnhancedSchema) {
    return Workspace.getProperties(schema, this.inventory)
  }

  public getAttribute(schema: Workspace.EnhancedSchema, attr: string): Workspace.EnhancedSchema | undefined {
    return this.swaggerUtil.getAttribute(schema, attr)
  }

  public enhancedSchema(schema: any, specPath?: string): Workspace.EnhancedSchema {
    return {
      value: schema,
      file: specPath || this.specPath!,
    }
  }
}
