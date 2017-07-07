"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const rule_1 = require("../rule");
exports.ArraySchemaMustHaveItems = "ArraySchemaMustHaveItems";
const jp = require('jsonpath');
rule_1.rules.push({
    id: "R2009",
    name: exports.ArraySchemaMustHaveItems,
    severity: "error",
    category: "SDKViolation",
    mergeState: rule_1.MergeStates.composed,
    openapiType: rule_1.OpenApiTypes.default,
    appliesTo_JsonQuery: "$.definitions.*.properties[?(@.type==='array')]",
    run: function* (doc, node, path) {
        const msg = "Please provide an 'items' property for array type: ";
        if (!node.hasOwnProperty('items')) {
            yield { message: `${msg} '${path[path.length - 2]}'`, location: path.slice(0, path.length - 2) };
        }
    }
});
