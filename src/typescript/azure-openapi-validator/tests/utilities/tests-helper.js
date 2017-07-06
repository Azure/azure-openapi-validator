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
const azure_openapi_validator_1 = require("../../../azure-openapi-validator");
const assert = require("assert");
const js_yaml_1 = require("js-yaml");
const fs = require('fs');
const path = require('path');
const pathToTestResources = "../../tests/resources/";
// run the validator and gather all the messages generated
function collectTestMessagesFromValidator(fileName, openapiType, mergeState) {
    return __awaiter(this, void 0, void 0, function* () {
        let messages = [];
        let getMessages = function (m) {
            messages.push(m);
        };
        const filePath = getFilePath(fileName);
        const openapiDefinitionObject = readObjectFromFile(filePath);
        yield azure_openapi_validator_1.run(filePath, openapiDefinitionObject, getMessages, openapiType, mergeState);
        return messages;
    });
}
exports.collectTestMessagesFromValidator = collectTestMessagesFromValidator;
// read the whole file into a string
function readFileAsString(file) {
    return fs.readFileSync(file);
}
// assert whether we have the expected number of validation rules of given type
function assertValidationRuleCount(messages, validationRule, count) {
    assert.equal(messages.filter(msg => msg.Details.code === validationRule).length, count);
}
exports.assertValidationRuleCount = assertValidationRuleCount;
// get all the warning messages generated
function getWarningMessages(messages) {
    return messages.filter(msg => msg.Channel === 'warning');
}
exports.getWarningMessages = getWarningMessages;
// get all the error messages generated
function getErrorMessages(messages) {
    return messages.filter(msg => msg.Channel === 'error');
}
exports.getErrorMessages = getErrorMessages;
// get all the messages of a certain type of rule
function getMessagesOfType(messages, validationRule) {
    return messages.filter(msg => msg.Details.name === validationRule);
}
exports.getMessagesOfType = getMessagesOfType;
// read the open api doc in a usable object
function readObjectFromFile(filePath) {
    return js_yaml_1.safeLoad(readFileAsString(filePath));
}
function getFilePath(fileName) {
    return path.resolve(path.join(__dirname, pathToTestResources, fileName));
}
