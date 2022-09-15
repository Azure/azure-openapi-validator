/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "@microsoft.azure/openapi-validator-core"
import { isValidEnum } from "../utilities/rules-helper"
export const XmsEnumValidation = "XmsEnumValidation"

rules.push({
  id: "R2018",
  name: XmsEnumValidation,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,
  appliesTo_JsonQuery: [
    "$.definitions..[?(@property==='enum')]^",
    "$..parameters..[?(@property==='enum')]^",
    "$..responses..[?(@property==='enum')]^",
  ],
  *run(doc, node, path) {
    const msg = `The enum types should have x-ms-enum type extension set with appropriate options.`
    if (node.enum && isValidEnum(node)) {
      if (!node["x-ms-enum"]) {
        yield { message: `${msg}`, location: path }
      }
    }
  },
})
