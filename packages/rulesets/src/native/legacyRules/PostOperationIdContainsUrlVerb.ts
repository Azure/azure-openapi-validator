/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "@microsoft.azure/openapi-validator-core"
export const PostOperationIdContainsUrlVerb = "PostOperationIdContainsUrlVerb"
rules.push({
  id: "R2066",
  name: PostOperationIdContainsUrlVerb,
  severity: "warning",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,

  appliesTo_JsonQuery: "$.paths.*[?(@property==='post')]^",
  *run(doc, node, path) {
    // path array returned here will be of the form ['paths', 'some/path']
    // pick the last element to get hold of the actual path
    // get the url
    const pathNodes: string[] = (path[path.length - 1] as string).toLowerCase().split("/")
    const urlVerb: string = pathNodes[pathNodes.length - 1]
    // now get hold of the operation id
    const keys = Object.keys(node)
    const postKey = keys.find((key) => {
      return key.toLowerCase() === "post"
    })
    if (postKey) {
      const operationId = node[postKey].operationId
      // operationIds are of the form Noun_Verb, get hold of the verb so we can perform
      // the check
      // check if we have an operation id without the verb at the end of the url
      // if not, this should be a violation
      if (operationId && operationId.toLowerCase().split("_").pop().indexOf(urlVerb) === -1) {
        yield {
          message: `OperationId should contain the verb: '${urlVerb}' in:'${operationId}'. Consider updating the operationId`,
          location: path.concat(postKey).concat("operationId"),
        }
      }
    }
  },
})
