"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const rule_1 = require("../rule");
exports.PostOperationIdContainsUrlVerb = "PostOperationIdContainsUrlVerb";
rule_1.rules.push({
    id: "R2064",
    name: exports.PostOperationIdContainsUrlVerb,
    severity: "warning",
    category: "SDKViolation",
    mergeState: rule_1.MergeStates.individual,
    openapiType: rule_1.OpenApiTypes.arm,
    appliesTo_JsonQuery: "$.paths[?(@.post)]",
    run: function* (doc, node, path) {
        // path array returned here will be of the form ['paths', 'some/path']
        // pick the last element to get hold of the actual path
        // get the url
        const urlVerb = path[path.length - 1].toLowerCase();
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
            yield { message: `OperationId should contain the verb: '${urlVerb}' in:'${node}'. Consider updating the operationId`, location: path.concat(postKey).concat(operationId) };
        }
    }
});
