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
  AssertValidationRuleCount,
  CollectTestMessagesFromValidator,
  ReadFileAsString
} from './utilities/tests-helper';
import { MergeStates, OpenApiTypes } from '../rule';
import { ControlCharactersAreNotAllowed } from '../rules/ControlCharactersAreNotAllowed';
import { PostOperationIdContainsUrlVerb } from '../rules/PostOperationIdContainsUrlVerb';

const filePathAnchor: string = 'src/azure-openapi-validator/tests/resources/'

@suite class IndividualAzureTests {
  @test @timeout(120000) async "control characters not allowed test"() {
    const file = filePathAnchor + 'ContainsControlCharacters.json';
    const openapiDefinitionDocument = ReadFileAsString(file);
    const openapiDefinitionObject = safeLoad(openapiDefinitionDocument);

    const messages: Message[] = await CollectTestMessagesFromValidator(file, openapiDefinitionObject, OpenApiTypes.arm, MergeStates.individual);
    AssertValidationRuleCount(messages, ControlCharactersAreNotAllowed, 2);
  }

  @test @timeout(120000) async "Post operation id must contain Url verb"() {
    const file = filePathAnchor + 'PostOperationIdWithoutUrlVerb.json';
    const openapiDefinitionDocument = ReadFileAsString(file);
    const openapiDefinitionObject = safeLoad(openapiDefinitionDocument);

    const messages: Message[] = await CollectTestMessagesFromValidator(file, openapiDefinitionObject, OpenApiTypes.arm, MergeStates.individual);
    AssertValidationRuleCount(messages, PostOperationIdContainsUrlVerb, 1);
  }
}