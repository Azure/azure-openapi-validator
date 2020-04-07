/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "../rule";
export const EnumUniqueValue: string = "EnumUniqueValue";

rules.push({
  id: "R3024",
  name: EnumUniqueValue,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,
  appliesTo_JsonQuery: "$..*[?(@.enum)]",
  run: function* (doc, node, path) {
    const msg: string = `Enum must not contain duplicated value (case insentive).`;
    if (node.enum !== undefined) {
      const enumList: string[] = node.enum;
      const caseInsensitiveSet = new Set<string>();
      if (
        enumList.some(value => {
          if (caseInsensitiveSet.has(value.toLowerCase())) {
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
