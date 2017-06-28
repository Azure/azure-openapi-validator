/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Message } from '../../../jsonrpc/types';
import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { AutoRestPluginHost } from "../../../jsonrpc/plugin-host";
import { run } from "../../../azure-openapi-validator";
import { MergeStates, OpenApiTypes } from '../../rule';
import * as assert from "assert";
import { safeLoad } from "js-yaml";

const fs = require('fs');
const path = require('path');
const pathToTestResources: string = "../../tests/resources/";

// run the validator and gather all the messages generated
export async function collectTestMessagesFromValidator(fileName: string, openapiType: OpenApiTypes, mergeState: MergeStates): Promise<Message[]> {

  let messages: Message[] = [];
  let getMessages = function (m: Message) {
    messages.push(m);
  }
  const filePath = getFilePath(fileName);
  const openapiDefinitionObject = readObjectFromFile(filePath);
  await run(filePath, openapiDefinitionObject, getMessages, openapiType, mergeState);
  return messages;
}

// read the whole file into a string
function readFileAsString(file: string): string {
  return fs.readFileSync(file);
}

// assert whether we have the expected number of validation rules of given type
export function assertValidationRuleCount(messages: Message[], validationRule: string, count: number): void {
  assert.equal(messages.filter(msg => msg.Details.code === validationRule).length, count);
}

// get all the warning messages generated
export function getWarningMessages(messages: Message[]): Message[] {
  return messages.filter(msg => msg.Channel === 'warning');
}

// get all the error messages generated
export function getErrorMessages(messages: Message[]): Message[] {
  return messages.filter(msg => msg.Channel === 'error');
}

// get all the messages of a certain type of rule
export function getMessagesOfType(messages: Message[], validationRule: string): Message[] {
  return messages.filter(msg => msg.Details.name === validationRule);
}

// read the open api doc in a usable object
function readObjectFromFile(filePath: string): any {
  return safeLoad(readFileAsString(filePath));
}

function getFilePath(fileName: string): string {
  return path.resolve(path.join(__dirname, pathToTestResources, fileName));
}