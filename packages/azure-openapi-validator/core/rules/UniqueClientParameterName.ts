import { nodes, stringify } from "../jsonpath"
import { MergeStates, OpenApiTypes, rules } from "../types"

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
    const getRefModel = (refValue: string) => {
      const pathExpression = refValue.replace(/^#\//, "").split("/")
      try {
        const result = nodes(doc, stringify(pathExpression))
        return result.length !== 0 ? result[0] : undefined
      } catch (err) {
        return undefined
      }
    }
    const checkParameterNameUnique = parameter => {
      if (parameter) {
        const ref = (parameter as any).$ref
        if (ref === undefined) {
          return true
        }

        const refModels = getRefModel(ref)
        if (refModels === undefined) {
          return true
        }
        const refModel = refModels.value
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

    const msg: string = `Do not have duplicate name of client parameter name, make sure every client parameter name unique. `
    for (const it of nodes(doc, "$.paths.*.*.parameters")) {
      for (const parameter of Object.values(it.value)) {
        if (!checkParameterNameUnique(parameter)) {
          const ref = (parameter as any).$ref as string
          const conflictMsg = `Client parameter ${(parameter as any).$ref} conflicted with ${clientParameterName.get(
            getRefModel(ref).value.name
          )}.`
          yield {
            location: path.concat(it.path.slice(1)),
            message: msg + conflictMsg
          }
        }
      }
    }

    for (const it of nodes(doc, "$.paths.*.parameters")) {
      for (const parameter of Object.values(it.value)) {
        if (!checkParameterNameUnique(parameter)) {
          const ref = (parameter as any).$ref as string
          const conflictMsg = `Client parameter ${(parameter as any).$ref} conflicted with ${clientParameterName.get(
            getRefModel(ref).value.name
          )}.`
          yield {
            location: path.concat(it.path.slice(1)),
            message: msg + conflictMsg
          }
        }
      }
    }
  }
})
