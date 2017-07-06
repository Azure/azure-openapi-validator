"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const rule_1 = require("../rule");
const mocha_typescript_1 = require("mocha-typescript");
const tests_helper_1 = require("./utilities/tests-helper");
const DescriptionMustNotBeNodeName_1 = require("../rules/DescriptionMustNotBeNodeName");
let CompositeAzureTests = class CompositeAzureTests {
    "description should not be property name"() {
        return __awaiter(this, void 0, void 0, function* () {
            const fileName = 'DescriptionSameAsPropertyName.json';
            const messages = yield tests_helper_1.collectTestMessagesFromValidator(fileName, rule_1.OpenApiTypes.arm, rule_1.MergeStates.composed);
            tests_helper_1.assertValidationRuleCount(messages, DescriptionMustNotBeNodeName_1.DescriptionMustNotBeNodeName, 1);
        });
    }
};
__decorate([
    mocha_typescript_1.test
], CompositeAzureTests.prototype, "description should not be property name", null);
CompositeAzureTests = __decorate([
    mocha_typescript_1.suite
], CompositeAzureTests);
