/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "@microsoft.azure/openapi-validator-core"
export const IntegerTypeMustHaveFormat = "IntegerTypeMustHaveFormat"

rules.push({
  id: "R4013",
  name: IntegerTypeMustHaveFormat,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,
  appliesTo_JsonQuery: "$..*[?(@property === 'type' && @ === 'integer')]^",
  *run(doc, node, path) {
    if (path.indexOf("x-ms-examples") === -1) {
      const msg = `The integer type does not have a format, please add it.`
      const formats = ["int32", "int64"]
      if (!node.format || formats.indexOf(node.format) === -1) {
        yield { message: `${msg}`, location: path }
      }
    }
  }
})
