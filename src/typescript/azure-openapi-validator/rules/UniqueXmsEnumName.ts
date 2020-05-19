/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "../rule"
export const UniqueXmsEnumName: string = "UniqueXmsEnumName"
import { nodes } from "jsonpath"

rules.push({
  id: "R4005",
  name: UniqueXmsEnumName,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,
  appliesTo_JsonQuery: "$.definitions",
  *run(doc, node, path) {
    const msg: string = `Must not have duplicate name of x-ms-enum extension , make sure every x-ms-enum name unique.`
    if (node) {
      const enumList: string[] = []
      for (const section of nodes(node, '$..["x-ms-enum"]')) {
        if (section.value.name) {
          enumList.push(section.value.name)
        }
      }
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
