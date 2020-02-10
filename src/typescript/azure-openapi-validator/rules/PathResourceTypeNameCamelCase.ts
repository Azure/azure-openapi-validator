import { MergeStates, OpenApiTypes } from "./../rule";
import { rules } from "../rule";
import {
  getAllResourceProvidersFromPath,
  getAllWordsFromPath
} from "../rules/utilities/rules-helper";

export const PathResourceTypeNameCamelCase: string =
  "PathResrouceTypeNameCamelCase";

rules.push({
  id: "R3021",
  name: PathResourceTypeNameCamelCase,
  severity: "warning",
  category: "ARMViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,

  run: function*(doc, node, path) {
    if (node.paths !== undefined) {
      const msg: string =
        "Resource type naming must follow camel case. Eg: proactiveDetectionConfigs, not ProactiveDetectionConfigs";
      const paths: string[] = Object.keys(node.paths);
      for (const it of paths) {
        const allWords = getAllWordsFromPath(it);
        const resourceProviders = new Set<string>(
          getAllResourceProvidersFromPath(it)
        );
        const resourceTypes = allWords.filter(
          subPath => !resourceProviders.has(subPath)
        );
        if (resourceTypes.some(it => !resourceTypeMustCamelCase(it))) {
          yield {
            message: `${msg} Path: '${it}'`,
            location: path.concat(["paths"])
          };
        }
      }
    }
  }
});

function resourceTypeMustCamelCase(resourceType: string): boolean {
  if (resourceType.length === 0) {
    return true;
  }
  const pascalCase: RegExp = new RegExp("^[a-z]+(?:[A-Z][a-z]+)*$");
  return pascalCase.test(resourceType);
}
