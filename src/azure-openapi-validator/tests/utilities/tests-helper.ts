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

const fs = require('fs');

// run the validator and gather all the messages generated
export async function CollectTestMessagesFromValidator(filename: string, openapiDefinitionObject: any, openapiType: OpenApiTypes = OpenApiTypes.arm, mergeState: MergeStates = MergeStates.composed): Promise<Message[]> {
  let messages: Message[] = [];
  let getMessages = function (m: Message) {
    messages.push(m);
  }

  await run(filename, openapiDefinitionObject, getMessages, openapiType, mergeState);
  return messages;
}

// read the whole file into a string
export function ReadFileAsString(file: string): string {
  return fs.readFileSync(file);
}

// assert whether we have the expected number of validation rules of given type
export function AssertValidationRuleCount(messages: Message[], validationRule: string, count: number): void {
  assert.equal(messages.filter(msg => msg.Details.code === validationRule).length, count);
}

// get all the warning messages generated
export function GetWarningMessages(messages: Message[]): Message[] {
  return messages.filter(msg => msg.Channel === 'warning');
}

// get all the error messages generated
export function GetErrorMessages(messages: Message[]): Message[] {
  return messages.filter(msg => msg.Channel === 'error');
}

// get all the messages of a certain type of rule
export function GetMessagesOfType(messages: Message[], validationRule: string): Message[] {
  return messages.filter(msg => msg.Details.name === validationRule);
}