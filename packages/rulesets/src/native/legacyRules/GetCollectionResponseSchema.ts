import { JsonPath, rules, MergeStates, OpenApiTypes } from "@microsoft.azure/openapi-validator-core"

import { ArmHelper } from "../utilities/arm-helper"
export const GetCollectionResponseSchema = "GetCollectionResponseSchema"

rules.push({
  // RPC code: RPC-Get-V1-10
  id: "R4019",
  name: GetCollectionResponseSchema,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$",
  *run(doc, node, path, ctx) {
    const msg =
      'The response in the GET collection operation "{0}" does not match the response definition in the individual GET operation "{1}".'
    /**
     * 1 travel all resources and find all the resources that have a collection get
     *   - by searching all the models return by a get operation and verify the schema
     * 2 check the collection model schema
     */
    const utils = new ArmHelper(doc, ctx?.specPath!, ctx?.inventory!)
    const allCollectionPath = utils.getCollectionApiInfo()
    for (const collection of allCollectionPath) {
      let hasMatched = false
      const resource = utils.getResourceByName(collection.modelName)
      const modelValue = utils?.getProperty(resource!, "value")
      if (modelValue) {
        hasMatched = utils.verifyCollectionModel(modelValue.value, collection.childModelName)
      }
      if (!hasMatched) {
        const collectionOperationId = utils.getOperationIdFromPath(collection.collectionGetPath[0])
        const specificOperationId = utils.getOperationIdFromPath(collection.specificGetPath[0])
        yield {
          message: msg.replace("{0}", collectionOperationId).replace("{1}", specificOperationId),
          location: ["$", "paths", collection.collectionGetPath[0]] as JsonPath,
        }
      }
    }
  },
})
