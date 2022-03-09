/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "../types"
export const XmsIdentifierValidation: string = "XmsIdentifierValidation"

rules.push({
  id: "R4041",
  name: XmsIdentifierValidation,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: ["$.definitions..[?(@.items)]", "$.parameters..[?(@.items)]"],
  async *run(doc, node, path, ctx) {
    if (node.type !== "array") {
      return
    }
    const utils = ctx.utils
    const identifiers = node["x-ms-identifiers"] ?? ["id"]
    const items = await utils.resolveSchema(node.items)
    if (items.type && items.type !== "object") {
      return
    }

    for (const identifier of identifiers) {
      const pathExpression = identifier.replace(/^\//, "").split("/")
      let item = items
      for (const key of pathExpression) {
        item = utils.getPropertyOfModel(item, key)
        if (item === undefined) {
          yield { message: `Missing identifier ${identifier} in array item property`, location: path }
          break
        }
      }
    }
  }
})
