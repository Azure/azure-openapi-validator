import { JsonPath, rules, MergeStates, OpenApiTypes } from "@microsoft.azure/openapi-validator-core"

import { ArmHelper } from "../utilities/arm-helper"
import { SwaggerHelper } from "../utilities/swagger-helper"
export const PrivateEndpointResourceSchemaValidation = "PrivateEndpointResourceSchemaValidation"

rules.push({
  id: "R4035",
  name: PrivateEndpointResourceSchemaValidation,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.paths.*",
  async *run(doc, node, path, ctx) {
    const msg = 'The private endpoint model "{0}" schema does not conform to the common type definition.'
    /**
     * 1 get all collection models
     * 2 travel all resources and paths to find all the resources that have a collection get
     */
    const privateEndpointConnection = /.*\/privateEndpointConnections(\/\{[^/]+\})*$/
    const privateLinkResources = /.*\/privateLinkResources$/
    const utils = new ArmHelper(doc, ctx?.specPath!, ctx?.inventory!)
    const swaggerUtil = new SwaggerHelper(doc, ctx?.specPath, ctx?.inventory)
    const apiPath = path[path.length - 1] as string

    const checkPrivateEndpoint = (model: any) => {
      const properties = swaggerUtil?.getProperty(model, "properties")
      if (!properties) {
        return false
      }
      const requiredProperties = ["privateEndpoint", "privateLinkServiceConnectionState"]
      if (requiredProperties.some((p) => !swaggerUtil?.getProperty(properties, p))) {
        return false
      }
      return true
    }
    const checkPrivateResources = (model: any) => {
      const properties = swaggerUtil?.getProperty(model, "properties")
      if (!properties) {
        return false
      }
      const requiredProperties = ["groupId", "requiredMembers", "requiredZoneNames"]
      if (requiredProperties.some((p) => !swaggerUtil?.getProperty(properties, p))) {
        return false
      }
      return true
    }

    if (privateEndpointConnection.test(apiPath)) {
      const model = utils.getResponseModelFromPath(apiPath)
      if (model) {
        const modelName = utils.stripDefinitionPath(model.value.$ref) || ""
        if (apiPath.endsWith("privateEndpointConnections")) {
          const privateEndpoint = utils?.getProperty(model, "value")
          const items = utils?.getAttribute(privateEndpoint, "items")
          if (!privateEndpoint || !items) {
            yield {
              message: msg.replace("{0}", modelName),
              location: [...path, "get", "responses", "200"] as JsonPath,
            }
          } else if (!checkPrivateEndpoint(items)) {
            yield {
              message: msg.replace("{0}", modelName),
              location: [...path, "get", "responses", "200"] as JsonPath,
            }
          }
        } else {
          if (!checkPrivateEndpoint(model)) {
            yield {
              message: msg.replace("{0}", modelName),
              location: [...path, "get", "responses", "200"] as JsonPath,
            }
          }
        }
      }
    }
    if (privateLinkResources.test(apiPath)) {
      const model = utils.getResponseModelFromPath(apiPath)
      if (model) {
        const modelName = utils.stripDefinitionPath(model.value.$ref) || ""
        const privateResources = utils?.getProperty(model, "value")
        const items = utils?.getAttribute(privateResources, "items")
        if (!privateResources) {
          yield {
            message: msg.replace("{0}", modelName),
            location: [...path, "get", "responses", "200"] as JsonPath,
          }
        } else if (!items || !checkPrivateResources(items)) {
          yield {
            message: msg.replace("{0}", modelName),
            location: [...path, "get", "responses", "200"] as JsonPath,
          }
        }
      }
    }
  },
})
