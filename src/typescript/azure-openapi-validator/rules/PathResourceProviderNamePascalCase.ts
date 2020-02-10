import { MergeStates, OpenApiTypes } from "./../rule";
import { rules } from "../rule";
import { getAllResourceProvidersFromPath } from "../rules/utilities/rules-helper";

export const PathResourceProviderNamePascalCase: string =
  "PathResourceProviderNamePascalCase";

rules.push({
  id: "R3020",
  name: PathResourceProviderNamePascalCase,
  severity: "warning",
  category: "ARMViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,

  run: function*(doc, node, path) {
    if (node.paths !== undefined) {
      const msg: string =
        "Resource provider naming must follow pascal case. Eg: Microsoft.Computer";
      const paths: string[] = Object.keys(node.paths);
      for (const it of paths) {
        const resourceProviders = getAllResourceProvidersFromPath(it);

        if (resourceProviders.some(rp => !resourceProviderMustPascalCase(rp))) {
          yield {
            message: `${msg} Path: '${it}'`,
            location: path.concat(["paths"])
          };
        }
      }
    }
  }
});

function resourceProviderMustPascalCase(resourceProvider: string): boolean {
  if (resourceProvider.length === 0) {
    return false;
  }
  const pascalCase: RegExp = new RegExp("^[A-Z][a-z]+(?:.[A-Z][a-z]+)*$");
  return pascalCase.test(resourceProvider);
}
