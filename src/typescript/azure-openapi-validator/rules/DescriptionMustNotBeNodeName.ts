/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "../rule"
export const DescriptionMustNotBeNodeName: string = "DescriptionMustNotBeNodeName"
rules.push({
  id: "R3011",
  name: DescriptionMustNotBeNodeName,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm,

  appliesTo_JsonQuery: "$..*[?(@property === 'description')]^",
  *run(doc, node, path) {
    const msg: string = "Description must not match the name of the node it is supposed to describe."
    // description can be of any type (including an object, so check for a string type)
    if (typeof node.description !== "string") {
      return
    }
    const nodeName = path[path.length - 1] as any
    const description = TrimDescription(node.description)

    if ("name" in node && typeof node.name === "string" && TrimDescription(node.name.toLowerCase()) === description) {
      yield { message: `${msg} Node name:'${node.name}' Description:'${node.description}'`, location: path.concat(["description"]) }
    } else if (typeof nodeName === "string" && TrimDescription(nodeName.toLowerCase()) === description) {
      yield { message: `${msg} Node name:'${nodeName}' Description:'${node.description}'`, location: path.concat(["description"]) }
    } else if (description === "description") {
      yield { message: `${msg} Node name:'description' Description:'${node.description}'`, location: path.concat(["description"]) }
    }
  }
})

function TrimDescription(description: string): string {
  return description
    .trim()
    .replace(/\./g, "")
    .toLowerCase()
}
