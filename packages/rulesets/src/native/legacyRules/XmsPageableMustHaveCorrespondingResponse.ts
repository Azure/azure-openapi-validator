/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "@microsoft.azure/openapi-validator-core"
import { getMostSuccessfulResponseKey, getResolvedSchemaByPath } from "../utilities/rules-helper"
export const XmsPageableMustHaveCorrespondingResponse = "XmsPageableMustHaveCorrespondingResponse"

rules.push({
  id: "R4012",
  name: XmsPageableMustHaveCorrespondingResponse,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.paths..[?(@property==='x-ms-pageable')]^",
  async *run(doc, node, path, ctx) {
    const nextLinkValue = node["x-ms-pageable"].nextLinkName
    // null is allowed
    if (!nextLinkValue) {
      return
    }
    const mostSuccesskey = getMostSuccessfulResponseKey(Object.keys(node.responses))

    const msg = `The operation: '${node.operationId}' is defined with x-ms-pageable enabled,but can not find the corresponding nextLink property in the response, please add it.`

    if (node.responses && node.responses[mostSuccesskey]) {
      const schemaPath = path.concat(["responses", mostSuccesskey, "schema"]) as string[]
      const resolvedSchema = getResolvedSchemaByPath(doc, schemaPath as string[], ctx?.inventory)
      const utils = ctx?.utils
      if (resolvedSchema && !utils?.getPropertyOfModel(resolvedSchema, nextLinkValue)) {
        yield { message: `${msg}`, location: path }
      }
    }
  }
})
