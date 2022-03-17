/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "@microsoft.azure/openapi-validator-core"
export const ArraySchemaMustHaveItems = "ArraySchemaMustHaveItems"

rules.push({
  id: "R2009",
  name: ArraySchemaMustHaveItems,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.default,
  appliesTo_JsonQuery: "$.definitions.*.properties[?(@.type==='array')]^",
  *run(doc, node, path) {
    const msg = "Please provide an 'items' property for array type: "
    if (!("items" in node)) {
      yield { message: `${msg} '${path[path.length - 2]}'`, location: path.slice(0, path.length - 2) }
    }
  }
})
