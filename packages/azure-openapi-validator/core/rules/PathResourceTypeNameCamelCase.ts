import { rules } from "../types"
import { getAllResourceProvidersFromPath, getAllWordsFromPath, resourceTypeMustCamelCase } from "./utilities/rules-helper"
import { MergeStates, OpenApiTypes } from "../types"

export const PathResourceTypeNameCamelCase: string = "PathResourceTypeNameCamelCase"

rules.push({
  id: "R3021",
  name: PathResourceTypeNameCamelCase,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,

  *run(doc, node, path) {
    if (node.paths !== undefined) {
      const msg: string = "Resource type naming must follow camel case."
      const paths: string[] = Object.keys(node.paths)
      for (const it of paths) {
        const allWords = getAllWordsFromPath(it)
        const resourceProviders = new Set<string>(getAllResourceProvidersFromPath(it))
        const resourceTypes = allWords.filter(subPath => !resourceProviders.has(subPath))
        if (resourceTypes.some(it => !resourceTypeMustCamelCase(it))) {
          yield {
            message: `${msg} Path: '${it}'`,
            location: path.concat(["paths", it])
          }
        }
      }
    }
  }
})
