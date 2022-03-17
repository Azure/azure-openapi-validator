import { MergeStates, OpenApiTypes, rules } from "@microsoft.azure/openapi-validator-core"
import { followReference } from "../utilities/ref-helper"
export const ParametersOrder = "ParametersOrder"

function getParametersFromPath(apiapiPath: string) {
  const parameters = apiapiPath
    .split("/")
    .filter(x => x.startsWith("{") && x.endsWith("}"))
    .map(x => x.slice(1, -1))
  return parameters
}

function isMethodParameter(schema: any, doc: any) {
  if (!schema.$ref && schema.in === "path") {
    return true
  }
  const resolvedParameter = followReference(doc, schema)
  if (resolvedParameter && resolvedParameter.in === "path" && resolvedParameter["x-ms-parameter-location"] === "method") {
    return true
  }
  return false
}

rules.push({
  id: "R4039",
  name: ParametersOrder,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.paths",
  *run(doc, node, path) {
    const msg = `The parameters:{0} should be kept in the same order as they present in the path.`
    for (const apiPath of Object.keys(node)) {
      const commonParameters = node[apiPath].parameters || []
      const httpMethods = Object.keys(node[apiPath]).filter(k => k.toLowerCase() !== "parameters")
      for (const method of httpMethods) {
        const resolvedPathParameters = commonParameters
          .concat(node[apiPath][method].parameters || [])
          .filter(x => isMethodParameter(x, doc))
          .map(x => followReference(doc, x).name)
        const parametersInPath = getParametersFromPath(apiPath).filter(p => resolvedPathParameters.includes(p))
        if (parametersInPath.some((value, index) => index < resolvedPathParameters.length && resolvedPathParameters[index] !== value)) {
          yield { message: msg.replace("{0}", resolvedPathParameters.join(",")), location: path.concat(apiPath, method) }
        }
      }
    }
  }
})
