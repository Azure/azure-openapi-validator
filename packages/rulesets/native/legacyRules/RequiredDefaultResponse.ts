/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "@microsoft.azure/openapi-validator-core"
export const RequiredDefaultResponse = "RequiredDefaultResponse"

rules.push({
  id: "R4010",
  name: RequiredDefaultResponse,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.paths.*.*.responses",
  *run(doc, node, path) {
    if (!node.default) {
      yield {
        message: `The response is defined but without a default error response implementation.Consider adding it.'`,
        location: path
      }
    }
  }
})
