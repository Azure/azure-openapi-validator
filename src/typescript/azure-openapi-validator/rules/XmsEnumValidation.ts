/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { nodes } from "jsonpath"
import { MergeStates, OpenApiTypes, rules } from "../rule"
import { isValidEnum } from "./utilities/rules-helper"
export const XmsEnumValidation: string = "XmsEnumValidation"

rules.push({
  id: "R2018",
  name: XmsEnumValidation,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,
  *run(doc, _, path) {
    const msg: string = `The enum types should have x-ms-enum type extension set with appropriate options.`
    const results = [...nodes(doc, `$.definitions..[?(@.enum)]`), ...nodes(doc, `$.parameters..[?(@.enum)]`)]
    for (const result of results) {
      const node = result.value
      if (node.enum && isValidEnum(node)) {
        if (!node["x-ms-enum"]) {
          yield { message: `${msg}`, location: result.path }
        }
      }
    }
  }
})
