/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "../rule";
export const XmsEnumNameUnique: string = "XmsEnumNameUnique";
import { nodes } from "jsonpath";

var enumList: string[] = []

rules.push({
  id: "R4005",
  name: XmsEnumNameUnique,
  severity: "warning",
  category: "ARMViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,
  appliesTo_JsonQuery: "$.definitions",
  run: function* (doc, node, path) {
    const msg: string = `extension x-ms-enum name must not contain case-insensitive duplicated value and make sure every name of xms-enum unique.`;
    if (node) {
      let enumList: string[] = []
      for (const section of nodes(
        node,
        "$..[\"x-ms-enum\"]"
      )) {
        if (section.value.name) {
          enumList.push(section.value.name);
        }
      }
      const caseInsensitiveSet = new Set<string>();
      if (
        enumList.some(value => {
          if (caseInsensitiveSet.has(value.toLowerCase())) {
            console.log("return true")
            return true;
          }
          caseInsensitiveSet.add(value.toLowerCase());
          return false;
        })
      ) {
        yield { message: `${msg}`, location: path };
      }
    }
  }
});
