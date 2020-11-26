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
    const clientParameterName = new Set<string>()
    const checkParameterNameUnique = parameter => {
      if (parameter) {
        const parameterName = (parameter as any).name
        const xMsParameterLocation = (parameter as any)["x-ms-parameter-location"]
        if (xMsParameterLocation) {
          return true
        }
        if (parameterName === undefined) {
          return true
        }
        if (clientParameterName.has(parameterName)) {
          return false
        } else {
          clientParameterName.add(parameterName)
        }
      }
      return true
    }

    const msg: string = `Do not have duplicate name of client parameter name, make sure every client parameter name unique. Duplicate client parameter name: `
    for (const it of nodes(node, "$.paths.*.*.parameters")) {
      for (const parameter of Object.values(it.value)) {
        if (!checkParameterNameUnique(parameter)) {
          yield {
            location: path.concat(it.path.slice(1)),
            message: msg + (parameter as any).name
          }
        }
      }
    }

    for (const it of nodes(node, "$.paths.*.parameters")) {
      for (const parameter of Object.values(it.value)) {
        if (!checkParameterNameUnique(parameter)) {
          yield {
            location: path.concat(it.path.slice(1)),
            message: msg + (parameter as any).name
          }
        }
      }
    }
  }
})
