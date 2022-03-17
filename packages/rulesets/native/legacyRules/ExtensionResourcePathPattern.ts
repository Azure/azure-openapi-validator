import { MergeStates, OpenApiTypes, rules } from "@microsoft.azure/openapi-validator-core"
export const ExtensionResourcePathPattern = "ExtensionResourcePathPattern"

rules.push({
  id: "R4038",
  name: ExtensionResourcePathPattern,
  severity: "error",
  category: "RPaaSViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.rpaas,
  appliesTo_JsonQuery: "$.paths",
  *run(doc, node, path) {
    const msg = `The path which is for extension routing resource type, shouldn't include the parent scope.`
    for (const apiPath of Object.keys(node)) {
      if (apiPath.indexOf("/providers/") !== apiPath.lastIndexOf("/providers/")) yield { message: msg, location: path.concat(apiPath) }
    }
  }
})
