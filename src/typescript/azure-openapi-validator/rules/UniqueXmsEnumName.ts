/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
<<<<<<< HEAD
import { MergeStates, OpenApiTypes, rules } from "../rule";
export const UniqueXmsEnumName: string = "UniqueXmsEnumName";
import { nodes } from "jsonpath";

var enumList: string[] = [];
=======
import { MergeStates, OpenApiTypes, rules } from "../rule"
export const UniqueXmsEnumName: string = "UniqueXmsEnumName"
import { nodes } from "jsonpath"
>>>>>>> d46f9ed84c2ab461bfaa84eeab4879a9d82b5133

rules.push({
  id: "R4005",
  name: UniqueXmsEnumName,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,
  appliesTo_JsonQuery: "$.definitions",
<<<<<<< HEAD
  run: function* (doc, node, path) {
    const msg: string = `Must not have duplicate name of x-ms-enum extension, make sure every x-ms-enum name unique. The x-ms-enum name is duplicate :`;
    if (node) {
      let enumList: string[] = [];
      for (const section of nodes(node, '$..["x-ms-enum"]')) {
        if (section.value.name) {
          enumList.push(section.value.name);
        }
      }
      const caseInsensitiveSet = new Set<string>();
      let enumName: string = "";
      if (
        enumList.some((value) => {
          if (caseInsensitiveSet.has(value.toLowerCase())) {
            enumName = value;
            return true;
          }
          caseInsensitiveSet.add(value.toLowerCase());
          return false;
        })
      ) {
        yield { message: `${msg} ${enumName}`, location: path };
      }
    }
  },
});
=======
  *run(doc, node, path) {
    const msg: string = `Must not have duplicate name of x-ms-enum extension , make sure every x-ms-enum name unique.`
    if (node) {
      const enumMap = new Map<string, string[]>()
      for (const section of nodes(node, "$..*[?(@.enum)]")) {
        if (section.value["x-ms-enum"]) {
          const enumName = section.value["x-ms-enum"].name.toLowerCase()
          if (enumMap.has(enumName)) {
            const curEnum = section.value.enum
            const existingEnum = enumMap.get(enumName)
            /**
             * if existing , check if the two enums' enties is same.
             */
            if (
              existingEnum.length !== curEnum.length ||
              existingEnum.some((value, index) => curEnum[index].toLowerCase() !== value.toLowerCase())
            ) {
              yield { message: `${msg} The duplicate x-ms-enum name is ${enumName}`, location: path.concat(section.path.slice(1)) }
            }
          } else {
            enumMap.set(enumName, section.value.enum)
          }
        }
      }
    }
  }
})
>>>>>>> d46f9ed84c2ab461bfaa84eeab4879a9d82b5133
