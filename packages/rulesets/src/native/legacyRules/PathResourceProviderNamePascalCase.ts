import { rules } from "@microsoft.azure/openapi-validator-core"
import { getAllResourceProvidersFromPath, resourceProviderMustPascalCase } from "../utilities/rules-helper"
import { MergeStates, OpenApiTypes } from "@microsoft.azure/openapi-validator-core"

export const PathResourceProviderNamePascalCase = "PathResourceProviderNamePascalCase"

rules.push({
  id: "R3020",
  name: PathResourceProviderNamePascalCase,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,

  *run(doc, node, path) {
    if (node.paths !== undefined) {
      const msg = "Resource provider naming must follow the pascal case."
      const paths: string[] = Object.keys(node.paths)
      for (const it of paths) {
        const resourceProviders = getAllResourceProvidersFromPath(it)

        if (resourceProviders.some(rp => !resourceProviderMustPascalCase(rp))) {
          yield {
            message: `${msg} Path: '${it}'`,
            location: path.concat(["paths", it])
          }
        }
      }
    }
  }
})
