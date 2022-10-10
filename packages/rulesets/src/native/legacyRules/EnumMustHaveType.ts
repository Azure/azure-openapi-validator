/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "@microsoft.azure/openapi-validator-core"
import { isValidEnum } from "../utilities/rules-helper"
export const EnumMustHaveType = "EnumMustHaveType"

rules.push({
  id: "R3015",
  name: EnumMustHaveType,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,
  appliesTo_JsonQuery: "$..*[?(@property==='enum')]^",
  *run(doc, node, path) {
    const msg = `Enum must define its type and "object" type is not allowed due to Autorest refuse to parse it.`

    /**
     * a bad example: enum might be a property
     */
    if (path.indexOf("x-ms-examples") === -1) {
      if (!isValidEnum(node)) {
        yield { message: `${msg}`, location: path }
      }
    }
  }
})
