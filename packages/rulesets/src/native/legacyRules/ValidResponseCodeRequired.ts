/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "@microsoft.azure/openapi-validator-core"

export const ValidResponseCodeRequired = "ValidResponseCodeRequired"

rules.push({
  id: "R4028",
  name: ValidResponseCodeRequired,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,
  appliesTo_JsonQuery: "$.paths.*.*.responses",
  *run(doc, node, path) {
    const msg = "There is no declared valid status code."
    const response: any = node
    if (response.default && Object.keys(response).length === 1) {
      yield { message: `${msg}`, location: path }
    } else {
      if (!Object.keys(response).some((v) => v.startsWith("20"))) {
        yield { message: `${msg}`, location: path }
      }
    }
  },
})
