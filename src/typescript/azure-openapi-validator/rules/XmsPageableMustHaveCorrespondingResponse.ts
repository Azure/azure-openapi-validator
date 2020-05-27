/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { nodes, stringify } from "jsonpath"
import { MergeStates, OpenApiTypes, rules } from "../rule"
import { getMostSuccessfulResponseKey, getResolvedSchemaByPath } from "./utilities/rules-helper"
export const XmsPageableMustHaveCorrespondingResponse: string = "XmsPageableMustHaveCorrespondingResponse"

rules.push({
  id: "R4012",
  name: XmsPageableMustHaveCorrespondingResponse,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.paths..['x-ms-pageable']",
  async *asyncRun(doc, node, path) {
    const nextLinkValue = node.nextLinkName
    // null is allowed
    if (!nextLinkValue) {
      return
    }
    const parentNode = nodes(doc, stringify(path.slice(0, path.length - 1)))[0].value
    const mostSuccesskey = getMostSuccessfulResponseKey(Object.keys(parentNode.responses))

    const msg: string = `The operation: '${parentNode.operationId}' is defined with x-ms-pageable enabled,but can not find the corresponding nextLink property in the response, please add it.`

    if (parentNode.responses && parentNode.responses[mostSuccesskey]) {
      const resolvedSchema = await getResolvedSchemaByPath(
        path.slice(0, path.length - 1).concat(["responses", mostSuccesskey, "schema"]),
        doc
      )
      if (!resolvedSchema || !resolvedSchema[nextLinkValue]) {
        yield { message: `${msg}`, location: path }
      }
    } else {
      yield { message: `${msg}`, location: path }
    }
  }
})
