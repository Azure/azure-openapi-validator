/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
export const PostOperationIdContainsUrlVerb: string = "PostOperationIdContainsUrlVerb";
rules.push({
  id: "S2008",
  name: PostOperationIdContainsUrlVerb,
  severity: "warning",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,

  appliesTo_JsonQuery: "$.paths[?(@.post)]",
  run: function* (doc, node, path) {
    // path array returned here will be of the form ['paths', 'some/path']
    // pick the last element to get hold of the actual path
    // get the url
    const urlVerb = (<string>path[path.length - 1]).toLowerCase();
    // now get hold of the operation id
    const keys = Object.keys(node);
    const postKey = keys.find(key => {
      return key.toLowerCase() === 'post';
    });
    const operationId = node[postKey].operationId;
    // operationIds are of the form Noun_Verb, get hold of the verb so we can perform
    // the check
    // check if we have an operation id without the verb at the end of the url
    // if not, this should be a violation
    if (operationId.toLowerCase().split('_').pop().indexOf(urlVerb) === -1) {
      yield { message: `OperationId must contain the verb: '${urlVerb}' in:'${node}'`, location: path };
    }
  }
});