import { JsonPath } from "../../jsonrpc/types"
import { rules } from "../rule"
import { MergeStates, OpenApiTypes } from "../rule"
import { ResourceUtils } from "./utilities/resourceUtils"
export const AzureResourceTagsSchema: string = "AzureResourceTagsSchema"

rules.push({
  id: "R4034",
  name: AzureResourceTagsSchema,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$",
  *run(doc, node, path) {
    const msg: string = 'The resource "{0}" tag schema does not meet the common type definition.'
    /**
     * 1 get all resources
     */
    const utils = new ResourceUtils(doc)
    const allResources = utils.getAllResourceNames()
    for (const resourceName of allResources) {

      const tagSchema = utils.getPropertyOfModelName(resourceName, "tags")
      if (tagSchema && (!tagSchema.additionalProperties || tagSchema.additionalProperties.type !== 'string'))
      {
        yield {
          message: msg.replace("{0}", resourceName),
          location: ["$", "definitions", resourceName] as JsonPath
        }
      }
    }
  }
})
