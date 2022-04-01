import { JsonPath } from "@microsoft.azure/openapi-validator-core"
import { rules } from "@microsoft.azure/openapi-validator-core"
import { MergeStates, OpenApiTypes } from "@microsoft.azure/openapi-validator-core"
import { ArmHelper } from "../utilities/armHelper"
export const PrivateEndpointResourceSchemaValidation = "PrivateEndpointResourceSchemaValidation"

rules.push({
  id: "R4035",
  name: PrivateEndpointResourceSchemaValidation,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.paths.*",
  *run(doc, node, path, ctx) {
    const msg = 'The private endpoint model "{0}" schema does not conform to the common type definition.'
    /**
     * 1 get all collection models
     * 2 travel all resources and paths to find all the resources that have a collection get
     */
    const privateEndpointConnection = /.*\/privateEndpointConnections(\/\{[^\/]+\})*$/
    const privateLinkResources = /.*\/privateLinkResources$/
    const utils = new ArmHelper(doc)
    const swaggerUtil = ctx?.utils
    const apiPath = path[path.length - 1] as string

    const checkPrivateEndpoint = (model: any) => {
      const properties = swaggerUtil?.getPropertyOfModel(model, "properties")
      if (!properties) {
        return false
      }
      const requiredProperties = ["privateEndpoint", "privateLinkServiceConnectionState"]
      if (requiredProperties.some(p => !swaggerUtil?.getPropertyOfModel(properties, p))) {
        return false
      }
      return true
    }
    const checkPrivateResources = (model: any) => {
      const properties = swaggerUtil?.getPropertyOfModel(model, "properties")
      if (!properties) {
        return false
      }
      const requiredProperties = ["groupId", "requiredMembers", "requiredZoneNames"]
      if (requiredProperties.some(p => !swaggerUtil?.getPropertyOfModel(properties, p))) {
        return false
      }
      return true
    }

    if (privateEndpointConnection.test(apiPath)) {
      const modelName = utils.getModelFromPath(apiPath)
      if (modelName) {
        const model = utils.getResourceByName(modelName)
        if (apiPath.endsWith("privateEndpointConnections")) {
          const privateEndpoint = swaggerUtil?.getPropertyOfModel(model, "value")
          if (!privateEndpoint || !privateEndpoint.items) {
            yield {
              message: msg.replace("{0}", modelName),
              location: ["$", "definitions", modelName] as JsonPath
            }
          } else if (!checkPrivateEndpoint(privateEndpoint.items)) {
            yield {
              message: msg.replace("{0}", modelName),
              location: ["$", "definitions", modelName] as JsonPath
            }
          }
        } else {
          if (!checkPrivateEndpoint(model)) {
            yield {
              message: msg.replace("{0}", modelName),
              location: ["$", "definitions", modelName] as JsonPath
            }
          }
        }
      }
    }
    if (privateLinkResources.test(apiPath)) {
      const modelName = utils.getModelFromPath(apiPath)
      if (modelName) {
        const model = utils.getResourceByName(modelName)
        const privateResources = utils?.getPropertyOfModel(model, "value")
        if (!privateResources) {
          yield {
            message: msg.replace("{0}", modelName),
            location: ["$", "definitions", modelName] as JsonPath
          }
        } else if (!privateResources.items || !checkPrivateResources(privateResources.items)) {
          yield {
            message: msg.replace("{0}", modelName),
            location: ["$", "definitions", modelName] as JsonPath
          }
        }
      }
    }
  }
})