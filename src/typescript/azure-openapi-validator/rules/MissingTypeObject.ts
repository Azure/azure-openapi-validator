/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "../rule"
export const MissingTypeObject: string = "MissingTypeObject"

rules.push({
  id: "R4037",
  name: MissingTypeObject,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,
  appliesTo_JsonQuery: "$.definitions.*",
  *run(doc, node, path) {
    const msg: string = `The model '{0}' is considered an object , but without a 'type:object', it will confuse the code generator, please add the missing 'type:object'.`
    if ((node.properties || node.additionalProperties) && !node.type) {
      yield {
        message: msg.replace(`{0}`, path[path.length - 1].toString()),
        location: path
      }
    }
  }
})
