import { nodes } from "jsonpath"
import { MergeStates, OpenApiTypes, rules } from "./../rule"

export const UniqueClientParameterName: string = "UniqueClientParameterName"

rules.push({
  id: "R4026",
  name: UniqueClientParameterName,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,
  appliesTo_JsonQuery: "$",
  *run(doc, node, path) {
    const clientParameterName = new Set<string>()
    for (const it of nodes(node, '$..["parameters"]')) {
      for (const parameter of Object.values(it.value)) {
        if (parameter) {
          const parameterName = (parameter as any).name
          if (parameterName === undefined) {
            continue
          }
          if (clientParameterName.has(parameterName)) {
            const msg: string = `Do not have duplicate name of client parameter name, make sure every client parameter name unique. Duplicate client parameter name: ${parameterName}`
            yield {
              location: path.concat(it.path.slice(1)),
              message: msg
            }
          } else {
            clientParameterName.add(parameterName)
          }
        }
      }
    }
  }
})
