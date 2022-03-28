/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "@microsoft.azure/openapi-validator-core"
export const AvoidEmptyResponseSchema = "AvoidEmptyResponseSchema"

rules.push({
  id: "R4008",
  name: AvoidEmptyResponseSchema,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.paths.*.*.responses.*.schema",
  *run(doc, node, path) {
    const msg = "Response schema must not be empty."
    if (!Object.keys(node).length) {
      yield { message: `${msg}`, location: path }
    }
  }
})
