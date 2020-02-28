/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "../rule";
export const EnumMustHaveType: string = "EnumMustHaveType";

rules.push({
  id: "R3015",
  name: EnumMustHaveType,
  severity: "warning",
  category: "ARMViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,
  appliesTo_JsonQuery: "$..*[?(@.enum)]",
  run: function*(doc, node, path) {
    const msg: string = `Enum must define its type and "object" type is not allowed due to Autorest refuse to parse it.`;
    if (node.type === undefined || node.type.toLowerCase() === "object") {
      yield { message: `${msg}`, location: path };
    }
  }
});
