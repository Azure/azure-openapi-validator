/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "@microsoft.azure/openapi-validator-core"
import { Workspace } from "../utilities/swagger-workspace"
export const XmsIdentifierValidation = "XmsIdentifierValidation"

rules.push({
  id: "R4041",
  name: XmsIdentifierValidation,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: ["$.definitions..[?(@property === 'items')]^", "$.parameters..[?(@property === 'items')]^"],
  async *run(doc, node, path, ctx) {
    if (node.type !== "array") {
      return
    }
    const identifiers = node["x-ms-identifiers"] ?? ["id"]
    const items = await Workspace.resolveRef({ file: ctx?.specPath!, value: node }, ctx?.inventory!)
    if (items && items.value.type && items.value.type !== "object") {
      return
    }

    for (const identifier of identifiers) {
      const pathExpression = identifier.replace(/^\//, "").split("/")
      let item = items
      for (const key of pathExpression) {
        item = Workspace.getProperty(item!, key, ctx?.inventory!)
        if (item === undefined) {
          yield { message: `Missing identifier ${identifier} in array item property`, location: path }
          break
        }
      }
    }
  },
})
