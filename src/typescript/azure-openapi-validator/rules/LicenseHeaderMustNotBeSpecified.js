"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const rule_1 = require("../rule");
exports.LicenseHeaderMustNotBeSpecified = "LicenseHeaderMustNotBeSpecified";
rule_1.rules.push({
    id: "R2065",
    name: exports.LicenseHeaderMustNotBeSpecified,
    severity: "warning",
    category: "SDKViolation",
    mergeState: rule_1.MergeStates.individual,
    openapiType: rule_1.OpenApiTypes.arm | rule_1.OpenApiTypes.dataplane,
    appliesTo_JsonQuery: "$..info['x-ms-code-generation-settings']",
    run: function* (doc, node, path) {
        const msg = `License header must not be specified inside x-ms-code-generation-settings. This is different for different sdks generated and is passed via command line/config file when generating the sdk.`;
        if (node.header !== undefined) {
            yield { message: `${msg}`, location: path };
        }
    }
});
