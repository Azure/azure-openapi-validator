import { MergeStates, OpenApiTypes, RuleContextLegacy, rules } from "@microsoft.azure/openapi-validator-core"
import { Workspace } from "../utilities/swagger-workspace"
export const ParametersOrder = "ParametersOrder"

function getParametersFromPath(apiPath: string) {
  const parameters = apiPath
    .split("/")
    .filter((x) => x.startsWith("{") && x.endsWith("}"))
    .map((x) => x.slice(1, -1))
  return parameters
}

function getPathMethodParameter(schema: any, ctx: RuleContextLegacy) {
  if (!schema.$ref && schema.in === "path") {
    return schema.name
  }
  const enhancedSchema = { file: ctx.specPath, value: schema }
  const resolvedParameter = Workspace.resolveRef(enhancedSchema, ctx?.inventory!)?.value
  if (resolvedParameter && resolvedParameter.in === "path" && resolvedParameter["x-ms-parameter-location"] === "method") {
    return resolvedParameter.name
  }
  return ""
}

rules.push({
  id: "R4039",
  name: ParametersOrder,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.paths",
  *run(doc, node, path, ctx) {
    const msg = `The parameters:{0} should be kept in the same order as they present in the path.`
    for (const apiPath of Object.keys(node)) {
      const commonParameters = node[apiPath].parameters || []
      const httpMethods = Object.keys(node[apiPath]).filter((k) => k.toLowerCase() !== "parameters")
      for (const method of httpMethods) {
        const resolvedPathParameters = commonParameters
          .concat(node[apiPath][method].parameters || [])
          .map((x: any) => getPathMethodParameter(x, ctx!))
          .filter((x: any) => x)
        const parametersInPath = getParametersFromPath(apiPath).filter((p) => resolvedPathParameters.includes(p))
        if (parametersInPath.some((value, index) => index < resolvedPathParameters.length && resolvedPathParameters[index] !== value)) {
          yield { message: msg.replace("{0}", resolvedPathParameters.join(",")), location: path.concat(apiPath, method) }
        }
      }
    }
  },
})
