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
const mocha_typescript_1 = require("mocha-typescript");
const tests_helper_1 = require("./utilities/tests-helper");
const rule_1 = require("../rule");
const ControlCharactersAreNotAllowed_1 = require("../rules/ControlCharactersAreNotAllowed");
const PostOperationIdContainsUrlVerb_1 = require("../rules/PostOperationIdContainsUrlVerb");
const LicenseHeaderMustNotBeSpecified_1 = require("../rules/LicenseHeaderMustNotBeSpecified");
let IndividualAzureTests = class IndividualAzureTests {
    "control characters not allowed test"() {
        return __awaiter(this, void 0, void 0, function* () {
            const fileName = 'ContainsControlCharacters.json';
            const messages = yield tests_helper_1.collectTestMessagesFromValidator(fileName, rule_1.OpenApiTypes.arm, rule_1.MergeStates.individual);
            tests_helper_1.assertValidationRuleCount(messages, ControlCharactersAreNotAllowed_1.ControlCharactersAreNotAllowed, 2);
        });
    }
    "post operation id must contain Url verb"() {
        return __awaiter(this, void 0, void 0, function* () {
            const fileName = 'PostOperationIdWithoutUrlVerb.json';
            const messages = yield tests_helper_1.collectTestMessagesFromValidator(fileName, rule_1.OpenApiTypes.arm, rule_1.MergeStates.individual);
            tests_helper_1.assertValidationRuleCount(messages, PostOperationIdContainsUrlVerb_1.PostOperationIdContainsUrlVerb, 1);
        });
    }
    "info section with x-ms-code-generation-settings must not contain a header"() {
        return __awaiter(this, void 0, void 0, function* () {
            const fileName = 'InfoWithLicenseHeader.json';
            const messages = yield tests_helper_1.collectTestMessagesFromValidator(fileName, rule_1.OpenApiTypes.arm, rule_1.MergeStates.individual);
            tests_helper_1.assertValidationRuleCount(messages, LicenseHeaderMustNotBeSpecified_1.LicenseHeaderMustNotBeSpecified, 1);
        });
    }
};
__decorate([
    mocha_typescript_1.test
], IndividualAzureTests.prototype, "control characters not allowed test", null);
__decorate([
    mocha_typescript_1.test
], IndividualAzureTests.prototype, "post operation id must contain Url verb", null);
__decorate([
    mocha_typescript_1.test
], IndividualAzureTests.prototype, "info section with x-ms-code-generation-settings must not contain a header", null);
IndividualAzureTests = __decorate([
    mocha_typescript_1.suite
], IndividualAzureTests);
