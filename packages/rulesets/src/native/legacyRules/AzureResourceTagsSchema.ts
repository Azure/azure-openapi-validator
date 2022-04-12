import { JsonPath } from "@microsoft.azure/openapi-validator-core"
import { rules } from "@microsoft.azure/openapi-validator-core"
import { MergeStates, OpenApiTypes } from "@microsoft.azure/openapi-validator-core"
import { ArmHelper } from "../utilities/arm-helper"
export const AzureResourceTagsSchema = "AzureResourceTagsSchema"

rules.push({
  id: "R4034",
  name: AzureResourceTagsSchema,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$",
  *run(doc, node, path) {
    const msg = 'The property tags in the resource "{0}" does not conform to the common type definition.'
    /**
     * 1. get all resources
     * 2. for each resource, check the property tags schema.
     */
    const utils = new ArmHelper(doc)
    const allResources = utils.getAllResourceNames()
    for (const resourceName of allResources) {
      const tagSchema = utils?.getPropertyOfModelName(resourceName, "tags")
      if (tagSchema && (!tagSchema.additionalProperties || tagSchema.additionalProperties.type !== "string")) {
        yield {
          message: msg.replace("{0}", resourceName),
          location: ["$", "definitions", resourceName] as JsonPath
        }
      }
    }
  }
})
