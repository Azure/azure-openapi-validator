/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { nodes } from "jsonpath"
import { MergeStates, OpenApiTypes, rules } from "../rule"
import { isValidEnum } from "./utilities/rules-helper"
export const EnumMustRespectType: string = "EnumMustRespectType"

rules.push({
  id: "R4040",
  name: EnumMustRespectType,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,
  *run(doc, _, path) {
    const msg: string = `Enum values should respect the type specifier.`
    const results = [...nodes(doc, `$.definitions..[?(@.enum)]`), ...nodes(doc, `$.parameters..[?(@.enum)]`)]
    for (const result of results) {
      const node = result.value
      if (node.enum && isValidEnum(node)) {
        if (
          node.enum.some(value => {
            if (node.type === "integer" && !Number.isInteger(value)) {
              return true
            }
            return typeof value !== node.type
          })
        ) {
          yield { message: `${msg}`, location: result.path }
        }
      }
    }
  }
})
