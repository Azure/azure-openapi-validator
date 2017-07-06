"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const jsonpath_1 = require("jsonpath");
const rule_1 = require("./rule");
// register rules
require("./rules/DescriptionMustNotBeNodeName");
require("./rules/ControlCharactersAreNotAllowed");
require("./rules/ArraySchemaMustHaveItems");
require("./rules/PostOperationIdContainsUrlVerb");
require("./rules/LicenseHeaderMustNotBeSpecified");
function run(document, openapiDefinition, sendMessage, openapiType, mergeState) {
    const rulesToRun = rule_1.rules.filter(rule => rule.mergeState === mergeState && (rule.openapiType & openapiType));
    for (const rule of rulesToRun) {
        for (const section of jsonpath_1.nodes(openapiDefinition, rule.appliesTo_JsonQuery || "$")) {
            for (const message of rule.run(openapiDefinition, section.value, section.path.slice(1))) {
                const readableCategory = rule.category;
                // try to extract provider namespace and resource type
                const path = message.location[1] === "paths" && message.location[2];
                const pathComponents = typeof path === "string" && path.split("/");
                const pathComponentsProviderIndex = pathComponents && pathComponents.indexOf("providers");
                const pathComponentsTail = pathComponentsProviderIndex && pathComponentsProviderIndex >= 0 && pathComponents.slice(pathComponentsProviderIndex + 1);
                const pathComponentProviderNamespace = pathComponentsTail && pathComponentsTail[0];
                const pathComponentResourceType = pathComponentsTail && pathComponentsTail[1];
                sendMessage({
                    Channel: rule.severity,
                    Text: message.message,
                    Key: [rule.name, rule.id, readableCategory],
                    Source: [{
                            document: document,
                            Position: { path: message.location }
                        }],
                    Details: {
                        type: rule.severity,
                        code: rule.name,
                        message: message.message,
                        id: rule.id,
                        validationCategory: readableCategory,
                        providerNamespace: pathComponentProviderNamespace,
                        resourceType: pathComponentResourceType
                    }
                });
            }
        }
    }
}
exports.run = run;
