import { RuleContext } from "@microsoft.azure/openapi-validator-core"
import _ from "lodash"
import { SwaggerWalker } from "../utilities/swagger-walker"

export function* implementPrivateEndpointApis(pathsNode: any, options: {}, ctx: RuleContext) {
  const msg = "The private endpoint API: {0} is missing."
  const path = ctx.location

  const privateEndpointConnectionPattern = /.*\/privateEndpointConnections(\/\{[^/]+\}){1}$/i
  const privateEndpointConnectionsPattern = /.*\/privateEndpointConnections$/i
  const privateLinkResourcesPattern = /.*\/privateLinkResources$/i
  type privateEndpointPaths = {
    PathForPrivateConnection?: string
    pathForListPrivateConnections?: string
    pathForListResources?: string
  }
  const supportedResources = new Map<string, privateEndpointPaths>()
  const setMap = (key: string, paths: privateEndpointPaths) => {
    const result = supportedResources.get(key) || ({} as privateEndpointPaths)
    for (const prop of Object.keys(paths)) {
      result[prop] = paths[prop]
    }
    supportedResources.set(key, result)
  }
  const walk = new SwaggerWalker(ctx.inventory!)
  walk.warkAll(["$.paths.*"], (apiPaths) => {
    const apiPath = apiPaths[1]
    if (privateEndpointConnectionPattern.test(apiPath)) {
      setMap(apiPath.split("/").slice(0, -2).join("/"), { PathForPrivateConnection: apiPath })
    }
    if (privateEndpointConnectionsPattern.test(apiPath)) {
      setMap(apiPath.split("/").slice(0, -1).join("/"), { pathForListPrivateConnections: apiPath })
    }
    if (privateLinkResourcesPattern.test(apiPath)) {
      setMap(apiPath.split("/").slice(0, -1).join("/"), { pathForListResources: apiPath })
    }
  })
  const pathPostfix = [
    "/privateEndpointConnections/{privateEndpointConnectionName}",
    "/privateLinkResources",
    "/privateEndpointConnections",
  ]
  for (const [key, value] of supportedResources.entries()) {
    if (!value.PathForPrivateConnection) {
      yield {
        message: msg.replace("{0}", key + pathPostfix[0]),
        location: path,
      }
    }
    if (!value.pathForListResources) {
      yield {
        message: msg.replace("{0}", key + pathPostfix[1]),
        location: path,
      }
    }
    if (!value.pathForListPrivateConnections) {
      yield {
        message: msg.replace("{0}", key + pathPostfix[2]),
        location: path,
      }
    }
  }
}
