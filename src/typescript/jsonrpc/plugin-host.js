"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const vscode_jsonrpc_1 = require("vscode-jsonrpc");
var IAutoRestPluginTarget_Types;
(function (IAutoRestPluginTarget_Types) {
    IAutoRestPluginTarget_Types.GetPluginNames = new vscode_jsonrpc_1.RequestType0("GetPluginNames");
    IAutoRestPluginTarget_Types.Process = new vscode_jsonrpc_1.RequestType2("Process");
})(IAutoRestPluginTarget_Types || (IAutoRestPluginTarget_Types = {}));
var IAutoRestPluginInitiator_Types;
(function (IAutoRestPluginInitiator_Types) {
    IAutoRestPluginInitiator_Types.ReadFile = new vscode_jsonrpc_1.RequestType2("ReadFile");
    IAutoRestPluginInitiator_Types.GetValue = new vscode_jsonrpc_1.RequestType2("GetValue");
    IAutoRestPluginInitiator_Types.ListInputs = new vscode_jsonrpc_1.RequestType1("ListInputs");
    IAutoRestPluginInitiator_Types.WriteFile = new vscode_jsonrpc_1.NotificationType4("WriteFile");
    IAutoRestPluginInitiator_Types.Message = new vscode_jsonrpc_1.NotificationType2("Message");
})(IAutoRestPluginInitiator_Types || (IAutoRestPluginInitiator_Types = {}));
class AutoRestPluginHost {
    constructor() {
        this.plugins = {};
    }
    Add(name, handler) {
        this.plugins[name] = handler;
    }
    Run() {
        return __awaiter(this, void 0, void 0, function* () {
            // connection setup
            const channel = vscode_jsonrpc_1.createMessageConnection(process.stdin, process.stdout, {
                error(message) { console.error("error: ", message); },
                info(message) { console.error("info: ", message); },
                log(message) { console.error("log: ", message); },
                warn(message) { console.error("warn: ", message); }
            });
            channel.onRequest(IAutoRestPluginTarget_Types.GetPluginNames, () => __awaiter(this, void 0, void 0, function* () { return Object.keys(this.plugins); }));
            channel.onRequest(IAutoRestPluginTarget_Types.Process, (pluginName, sessionId) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const handler = this.plugins[pluginName];
                    if (!handler) {
                        throw new Error(`Plugin host could not find requested plugin '${pluginName}'.`);
                    }
                    yield handler({
                        ReadFile(filename) {
                            return __awaiter(this, void 0, void 0, function* () {
                                return yield channel.sendRequest(IAutoRestPluginInitiator_Types.ReadFile, sessionId, filename);
                            });
                        },
                        GetValue(key) {
                            return __awaiter(this, void 0, void 0, function* () {
                                return yield channel.sendRequest(IAutoRestPluginInitiator_Types.GetValue, sessionId, key);
                            });
                        },
                        ListInputs() {
                            return __awaiter(this, void 0, void 0, function* () {
                                return yield channel.sendRequest(IAutoRestPluginInitiator_Types.ListInputs, sessionId);
                            });
                        },
                        WriteFile(filename, content, sourceMap) {
                            channel.sendNotification(IAutoRestPluginInitiator_Types.WriteFile, sessionId, filename, content, sourceMap);
                        },
                        Message(message) {
                            channel.sendNotification(IAutoRestPluginInitiator_Types.Message, sessionId, message);
                        }
                    });
                    return true;
                }
                catch (e) {
                    channel.sendNotification(IAutoRestPluginInitiator_Types.Message, sessionId, {
                        Channel: "fatal",
                        Text: "" + e,
                        Details: e
                    });
                    return false;
                }
            }));
            // activate
            channel.listen();
        });
    }
}
exports.AutoRestPluginHost = AutoRestPluginHost;
