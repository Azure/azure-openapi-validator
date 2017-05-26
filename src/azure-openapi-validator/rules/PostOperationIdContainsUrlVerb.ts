/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
export const PostOperationIdContainsUrlVerb: string = "PostOperationIdContainsUrlVerb";
rules.push({
  id: "M4001",
  name: PostOperationIdContainsUrlVerb,
  severity: "warning",
  category: ["SDKViolation"],
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,

  appliesTo_JsonQuery: "$.paths.*.post.operationId",
  run: function* (doc, node, path) {
    // get the url
    const urlVerb = (<string>path[path.length - 3]).split('/').pop();
    // check if we have an operation id without the verb at the end of the url
    // if not, this should be a violation
    if (node.toLowerCase().split('_').pop().indexOf(urlVerb) === -1) {
      yield { message: `OperationId must contain the verb:'${urlVerb}' in:'${node}'`, location: path };
    }
  }

});