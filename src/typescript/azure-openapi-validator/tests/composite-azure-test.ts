/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes } from '../rule';
import { Message } from '../../jsonrpc/types';
import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { AutoRestPluginHost } from "../../jsonrpc/plugin-host";
import { run } from "../../azure-openapi-validator";
import {
  assertValidationRuleCount,
  collectTestMessagesFromValidator
} from './utilities/tests-helper';
import { DescriptionMustNotBeNodeName } from '../rules/DescriptionMustNotBeNodeName';

@suite class CompositeAzureTests {
  @test async "description should not be property name"() {
    const fileName: string = 'DescriptionSameAsPropertyName.json';
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.composed);
    assertValidationRuleCount(messages, DescriptionMustNotBeNodeName, 2);
  }
}
