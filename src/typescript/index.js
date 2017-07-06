"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_yaml_1 = require("js-yaml");
const plugin_host_1 = require("./jsonrpc/plugin-host");
const azure_openapi_validator_1 = require("./azure-openapi-validator");
const rule_1 = require("./azure-openapi-validator/rule");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const pluginHost = new plugin_host_1.AutoRestPluginHost();
        pluginHost.Add("azure-openapi-validator", (initiator) => __awaiter(this, void 0, void 0, function* () {
            const files = yield initiator.ListInputs();
            const mergeState = yield initiator.GetValue('merge-state');
            const openapiType = yield initiator.GetValue('openapi-type');
            for (const file of files) {
                initiator.Message({
                    Channel: "verbose",
                    Text: `Validating '${file}'`
                });
                try {
                    const openapiDefinitionDocument = yield initiator.ReadFile(file);
                    const openapiDefinitionObject = js_yaml_1.safeLoad(openapiDefinitionDocument);
                    yield azure_openapi_validator_1.run(file, openapiDefinitionObject, initiator.Message.bind(initiator), rule_1.OpenApiTypes[openapiType], rule_1.MergeStates[mergeState]);
                }
                catch (e) {
                    initiator.Message({
                        Channel: "fatal",
                        Text: `Failed validating: '${file}', error encountered: ` + e
                    });
                }
            }
        }));
        yield pluginHost.Run();
    });
}
main();
