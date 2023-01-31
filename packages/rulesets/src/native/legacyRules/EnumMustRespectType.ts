/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "@microsoft.azure/openapi-validator-core"
import { isValidEnum } from "../utilities/rules-helper"
export const EnumMustRespectType = "EnumMustRespectType"

rules.push({
  id: "R4040",
  name: EnumMustRespectType,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,
  appliesTo_JsonQuery: ['$.parameters..[?(@property === "enum")]^', '$.definitions..[?(@property === "enum")]^'],
  *run(doc, node, path) {
    const msg = `Enum values should respect the type.`
    if (node.enum && isValidEnum(node)) {
      if (
        node.enum.some((value: any) => {
          if (node.type === "integer") {
            return !Number.isInteger(value)
          }
          return typeof value !== node.type
        })
      ) {
        yield { message: `${msg}`, location: path }
      }
    }
  },
})
