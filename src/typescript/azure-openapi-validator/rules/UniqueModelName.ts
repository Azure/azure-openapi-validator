import { MergeStates, OpenApiTypes, rules } from "../rule"
export const UniqueModelName: string = "UniqueModelName"

rules.push({
  id: "R4033",
  name: UniqueModelName,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.definitions",
  *run(doc, node, path) {
    const msg: string = `The model name {0} is duplicated with {1} .`
    const examples = new Map<string,string>()
    for (const key of Object.keys(node)) {

      if (examples.has(key.toLowerCase())) {
        yield { message: msg.replace("{0}",key).replace("{1}",examples.get(key.toLowerCase())), location: path.concat(key) }
      }
      else {
        examples.set(key.toLowerCase(),key)
      }
    }
  }
})
