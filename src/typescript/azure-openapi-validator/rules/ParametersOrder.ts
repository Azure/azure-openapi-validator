import { MergeStates, OpenApiTypes, rules } from "../rule"
import { deReference } from "../rules/utilities/rules-helper"
export const ParametersOrder: string = "ParametersOrder"

function getParametersFromPath(apiapiPath: string) {
  const parameters = apiapiPath
    .split("/")
    .filter(x => x.startsWith("{") && x.endsWith("}"))
    .map(x => x.slice(1, -1))
  return parameters
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
    const msg: string = `The parameters should be arranged as the order in the apiPath.`
    for (const apiPath of Object.keys(node)) {
      const parametersInPath = getParametersFromPath(apiPath)
      const commonParameters = node[apiPath].parameters || []
      const httpMethods = Object.keys(node[apiPath]).filter(k => k.toLowerCase() !== "parameters")
      for (const method of httpMethods) {
        const resolvedPathParameters = (node[apiPath][method].parameters || [])
          .concat(commonParameters)
          .map(x => deReference(doc, x))
          .filter(x => x && x.in === "path")
          .map(x => x.name)
        if (parametersInPath.some((value, index) => index < resolvedPathParameters.length && resolvedPathParameters[index] !== value)) {
          yield { message: msg, location: path.concat(apiPath, method) }
        }
      }
    }
  }
})
