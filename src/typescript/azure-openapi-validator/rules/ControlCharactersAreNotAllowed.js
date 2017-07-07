"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const rule_1 = require("../rule");
exports.ControlCharactersAreNotAllowed = "ControlCharactersAreNotAllowed";
rule_1.rules.push({
    id: "R2006",
    name: exports.ControlCharactersAreNotAllowed,
    severity: "error",
    category: "SDKViolation",
    mergeState: rule_1.MergeStates.individual,
    openapiType: rule_1.OpenApiTypes.arm,
    appliesTo_JsonQuery: "$..*",
    run: function* (doc, node, path) {
        const msg = "May not contain control characters: ";
        if (typeof node === "string") {
            const nodeValue = node;
            var controlChars = nodeValue.split('').filter(ch => ch < ' ' && ch !== '\t' && ch !== '\n' && ch !== '\r');
            if (controlChars.length > 0) {
                yield { message: `${msg} Characters:'${controlChars}' in:'${nodeValue}'`, location: path };
            }
        }
    }
});
