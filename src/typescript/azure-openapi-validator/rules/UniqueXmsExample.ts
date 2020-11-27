import { nodes } from "jsonpath"
import { MergeStates, OpenApiTypes, rules } from "./../rule"

export const UniqueXmsExample: string = "UniqueXmsExample"

rules.push({
  id: "R4030",
  name: UniqueXmsExample,
  severity: "warning",
  category: "SDKViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$",
  *run(doc, node, path) {
    const msg: string = `Do not have duplicate name of x-ms-example, make sure every x-ms-example name unique. Duplicate x-ms-example: `
    const examples = new Set<string>()
    for (const it of nodes(node, '$.paths.*.*["x-ms-examples"]')) {
      if (it.value !== null) {
        for (const exampleName of Object.keys(it.value)) {
          if (examples.has(exampleName)) {
            yield { message: msg + exampleName, location: path.concat(it.path.slice(1)) }
          }
          examples.add(exampleName)
        }
      }
    }
  }
})
