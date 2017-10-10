/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { suite, test } from 'mocha-typescript';
import * as assert from "assert";
import { Message } from '../../jsonrpc/types';
import { MergeStates, OpenApiTypes } from '../rule';
import { ControlCharactersAreNotAllowed } from '../rules/ControlCharactersAreNotAllowed';
import { LicenseHeaderMustNotBeSpecified } from '../rules/LicenseHeaderMustNotBeSpecified';
import { PostOperationIdContainsUrlVerb } from '../rules/PostOperationIdContainsUrlVerb';
import { assertValidationRuleCount, collectTestMessagesFromValidator } from './utilities/tests-helper';

@suite class IndividualAzureTests {
  @test async "control characters not allowed test"() {
    const fileName: string = 'ContainsControlCharacters.json';
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual);
    assertValidationRuleCount(messages, ControlCharactersAreNotAllowed, 2);
  }

  @test async "post operation id must contain Url verb"() {
    const fileName = 'PostOperationIdWithoutUrlVerb.json';
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual);
    assertValidationRuleCount(messages, PostOperationIdContainsUrlVerb, 1);
	assert(messages[0].Text === "OperationId should contain the verb: 'invoke' in:'simpleManualTrigger_call'. Consider updating the operationId");
  }
  @test async "info section with x-ms-code-generation-settings must not contain a header"() {
    const fileName = 'InfoWithLicenseHeader.json';
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual);
    assertValidationRuleCount(messages, LicenseHeaderMustNotBeSpecified, 1);
  }

}