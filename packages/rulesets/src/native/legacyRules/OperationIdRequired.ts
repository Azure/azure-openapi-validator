/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "@microsoft.azure/openapi-validator-core"
import { isValidOperation } from "../utilities/rules-helper"
export const OperationIdRequired = "OperationIdRequired"

rules.push({
  id: "R4004",
  name: OperationIdRequired,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.paths",
  *run(doc, node, path) {
    if (node) {
      for (const pathKey in node) {
        for (const op in node[pathKey]) {
          if (!isValidOperation(op)) {
            continue
          }
          if (!node[pathKey][op].operationId) {
            yield {
              message: `Missing operationId in path:'${pathKey}', operation:'${op}', consider adding the operationId .`,
              location: path.concat([pathKey, op])
            }
          }
        }
      }
    }
  }
})
