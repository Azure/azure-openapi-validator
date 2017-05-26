/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Message } from '../../jsonrpc/types';
import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { safeLoad } from "js-yaml";
import { AutoRestPluginHost } from "../../jsonrpc/plugin-host";
import { run } from "../../azure-openapi-validator";
import {
  assertValidationRuleCount,
  collectTestMessagesFromValidator
} from './utilities/tests-helper';
import { MergeStates, OpenApiTypes } from '../rule';
import { ControlCharactersAreNotAllowed } from '../rules/ControlCharactersAreNotAllowed';

const filePathAnchor: string = 'src/azure-openapi-validator/tests/resources/'

@suite class IndividualAzureTests {
  @test @timeout(120000) async "control characters not allowed test"() {
    const fileName: string = 'ContainsControlCharacters.json';
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual);
    assertValidationRuleCount(messages, ControlCharactersAreNotAllowed, 2);
  }
}