/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { nodes } from "jsonpath"
import { MergeStates, OpenApiTypes, rules } from "../rule"

export const OnlyDefaultErrorResponse: string = "OnlyDefaultErrorResponse"

rules.push({
  id: "R4028",
  name: OnlyDefaultErrorResponse,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.paths.*.*.responses",
  async *asyncRun(doc, node, path) {
    const msg: string = "Only has the default error response ."
    for (const n of nodes(doc, "$.paths.*.*.responses")) {
      const response: any = n.value
      if (response.default && Object.keys(response).length === 1) {
        yield { message: `${msg}`, location: path }
      }
    }
  }
})
