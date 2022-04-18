/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "@microsoft.azure/openapi-validator-core"
export const DeleteOperationResponses = "DeleteOperationResponses"

rules.push({
  id: "R4011",
  name: DeleteOperationResponses,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.paths.*.delete.responses",
  *run(doc, node, path) {
    // async delete is not in the scope
    if (node["202"] || node["x-ms-long-running-operation"]) {
      return
    }
    if (!node["200"] || !node["204"] || !Object.keys(node["200"]) || !Object.keys(node["204"])) {
      yield {
        message: `The delete operation is defined without a 200 or 204 error response implementation,please add it.'`,
        location: path
      }
    }
  }
})
