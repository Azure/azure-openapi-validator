/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes } from '../rule';
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

@suite class CompositeAzureTests {
  @test @timeout(120000) async "description should not be parameter name"() {
    const file = 'src/azure-openapi-validator/tests/resources/DescriptionSameAsPropertyName.json';
    const openapiDefinitionDocument = ReadFileAsString(file);
    const openapiDefinitionObject = safeLoad(openapiDefinitionDocument);
    let messages: Message[] = await CollectTestMessagesFromValidator(file, openapiDefinitionObject, OpenApiTypes.arm, MergeStates.composed);
    AssertValidationRuleCount(messages, 'DescriptionMustNotBeNodeName', 1);
  }

}