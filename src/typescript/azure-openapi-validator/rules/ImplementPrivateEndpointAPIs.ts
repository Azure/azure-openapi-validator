import { JsonPath } from "../../jsonrpc/types"
import { rules } from "../rule"
import { MergeStates, OpenApiTypes } from "../rule"
import { ResourceUtils } from "./utilities/resourceUtils"
export const ImplementPrivateEndpointAPIs: string = "ImplementPrivateEndpointAPIs"

rules.push({
  id: "R4036",
  name: ImplementPrivateEndpointAPIs,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.paths",
  *run(doc, node, path) {
    const msg: string = "The private endpoint API: {apiPath} is missing." 
    
    const privateEndpointConnectionPattern = /.*\/privateEndpointConnections(\/\{.*\}){1}$/
    const privateEndpointConnectionsPattern = /.*\/privateEndpointConnections$/
    const privateLinkResourcesPattern = /.*\/privateLinkResources$/
    type privateEndpointPaths = {
      PathForPrivateConnection ?:string,
      pathForListPrivateConnections ?:string,
      pathForListResources?:string
    }
    const supportedResources = new Map< string,
      privateEndpointPaths> ()
      const setMap =  (key:string,paths:privateEndpointPaths)=> {
         const result = supportedResources.get(key) || {} as privateEndpointPaths
         for (const prop of Object.keys(paths)) {
           result[prop] = paths[prop]
         }
         supportedResources.set(key,result)
      }

    for (const apiPath of Object.keys(node)) {
       if (privateEndpointConnectionPattern.test(apiPath)) {
         setMap(
           apiPath
             .split("/")
             .slice(0, -2)
             .join("/"),
           { PathForPrivateConnection:apiPath}
         )
       }
       if (privateEndpointConnectionsPattern.test(apiPath)) {
          setMap(
            apiPath
              .split("/")
              .slice(0, -1)
              .join("/"),
            { pathForListPrivateConnections: apiPath }
          )
       }
       if (privateLinkResourcesPattern.test(apiPath)) {
           setMap(
             apiPath
               .split("/")
               .slice(0, -1)
               .join("/"),
             { pathForListResources: apiPath }
           )
       }
    }
    const pathPostfix = [
      "/privateEndpointConnections/{privateEndpointConnectionName}",
      "/privateLinkResources",
      "/privateEndpointConnections"
    ]
    for( const [key,value] of supportedResources.entries()) {
      if (!value.PathForPrivateConnection) {
        yield {
           message: msg.replace("{0}",key + pathPostfix[1]),
           location: path
        }
      }
      if (!value.pathForListPrivateConnections) {
        yield {
           message: msg.replace("{0}", key + pathPostfix[1]),
           location: path
        }
      }
       if (!value.pathForListResources) {
        yield {
           message: msg.replace("{0}", key + pathPostfix[2]),
           location: path
        }
      }
    }
  }
})
