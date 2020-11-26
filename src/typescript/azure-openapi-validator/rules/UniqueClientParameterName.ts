import { nodes } from "jsonpath"
import { MergeStates, OpenApiTypes, rules } from "./../rule"

export const UniqueClientParameterName: string = "UniqueClientParameterName"

rules.push({
  id: "R4029",
  name: UniqueClientParameterName,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,
  appliesTo_JsonQuery: "$",
  *run(doc, node, path) {
    const clientParameterName = new Map<string, string>()
    const checkParameterNameUnique = parameter => {
      if (parameter) {
        const ref = (parameter as any).$ref
        if (ref === undefined) {
          return true
        }

        const getRefModel = (refValue: string) => {
          const refPath = refValue.replace("#", "$").replace(/\//g, ".")
          return nodes(doc, refPath)
        }

        const refModel = getRefModel(ref)[0].value
        const parameterName = (refModel as any).name
        const xMsParameterLocation = (refModel as any)["x-ms-parameter-location"]
        const parameterIn = (refModel as any).in
        if (xMsParameterLocation === "method" || parameterIn !== "path") {
          return true
        }
        if (clientParameterName.has(parameterName)) {
          return clientParameterName.get(parameterName) === ref
        } else {
          clientParameterName.set(parameterName, ref)
        }
      }
      return true
    }

    const msg: string = `Do not have duplicate name of client parameter name, make sure every client parameter name unique. Duplicate client parameter name: `
    for (const it of nodes(doc, "$.paths.*.*.parameters")) {
      for (const parameter of Object.values(it.value)) {
        if (!checkParameterNameUnique(parameter)) {
          yield {
            location: path.concat(it.path.slice(1)),
            message: msg + (parameter as any).$ref
          }
        }
      }
    }

    for (const it of nodes(doc, "$.paths.*.parameters")) {
      for (const parameter of Object.values(it.value)) {
        if (!checkParameterNameUnique(parameter)) {
          yield {
            location: path.concat(it.path.slice(1)),
            message: msg + (parameter as any).$ref
          }
        }
      }
    }
  }
})
