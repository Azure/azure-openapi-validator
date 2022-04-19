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
    const msg: string = `The schema '{0}' is considered an object but without a 'type:object', please add the missing 'type:object'.`
    const isMissingTypeObject = (node: any) => {
      return node && (node.properties || node.additionalProperties) && !node.type
    }
    type NodePath = {
      node: any
      path: (string | number)[]
    }

    const keys: NodePath[] = []
    keys.push({ node, path })

    while (keys.length) {
      const tail = keys.pop()
      const node = tail.node
      const path = tail.path

      if (isMissingTypeObject(node)) {
        yield {
          message: msg.replace(`{0}`, path[path.length - 1].toString()),
          location: path
        }
      }
      if (node.properties) {
        Object.keys(node.properties).forEach(p => keys.push({ node: node.properties[p], path: path.concat(["properties", p]) }))
      }
      if (node.additionalProperties) {
        keys.push({ node: node.additionalProperties, path: path.concat(["additionalProperties"]) })
      }
      if (node.type === "array" && node.items) {
        keys.push({ node: node.items, path: path.concat(["items"]) })
      }
      if (node.allOf && Array.isArray(node.allOf)) {
        node.allOf.forEach((element, index) => {
          keys.push({ node: element, path: path.concat(["allOf", index]) })
        })
      }
    }
  }
})
