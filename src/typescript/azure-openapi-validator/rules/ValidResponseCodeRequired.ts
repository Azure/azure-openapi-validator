/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { nodes } from "jsonpath"
import { MergeStates, OpenApiTypes, rules } from "../rule"

export const ValidResponseCodeRequired: string = "ValidResponseCodeRequired"

rules.push({
  id: "R4028",
  name: ValidResponseCodeRequired,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.paths.*.*.responses",
  async *asyncRun(doc, node, path) {
    const msg: string = "There is no declared valid status code."
    const response: any = node
    if (response.default && Object.keys(response).length === 1) {
      yield { message: `${msg}`, location: path }
    } else {
      if (!Object.keys(response).some(v => v.startsWith("20"))) {
        yield { message: `${msg}`, location: path }
      }
    }
  }
})
