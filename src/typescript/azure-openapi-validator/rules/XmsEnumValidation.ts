/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
  appliesTo_JsonQuery: ["$.definitions..[?(@.enum)]", "$..parameters..[?(@.enum)]"],
  *run(doc, node, path) {
    const msg: string = `The enum types should have x-ms-enum type extension set with appropriate options.`
    if (node.enum && isValidEnum(node)) {
      if (!node["x-ms-enum"]) {
        yield { message: `${msg}`, location: path }
      }
    }
  }
})
