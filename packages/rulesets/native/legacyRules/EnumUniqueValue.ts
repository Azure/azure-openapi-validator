/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "@microsoft.azure/openapi-validator-core"
import { isValidEnum, transformEnum } from "../utilities/rules-helper"
export const EnumUniqueValue = "EnumUniqueValue"

rules.push({
  id: "R3024",
  name: EnumUniqueValue,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,
  appliesTo_JsonQuery: "$..*[?(@property === 'enum')]^",
  *run(doc, node, path) {
    const msg = `Enum must not contain duplicated value (case insentive).`
    if (node.enum && path.indexOf("x-ms-examples") === -1 && isValidEnum(node)) {
      const enumList = transformEnum(node.type, node.enum)
      const caseInsensitiveSet = new Set<string>()
      if (
        enumList.some(value => {
          if (caseInsensitiveSet.has(value.toLowerCase())) {
            return true
          }
          caseInsensitiveSet.add(value.toLowerCase())
          return false
        })
      ) {
        yield { message: `${msg}`, location: path }
      }
    }
  }
})
