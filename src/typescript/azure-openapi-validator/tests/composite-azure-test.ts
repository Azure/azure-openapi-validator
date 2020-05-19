/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as assert from "assert"
import { only, skip, slow, suite, test, timeout } from "mocha-typescript"
import { run } from "../../azure-openapi-validator"
import { AutoRestPluginHost } from "../../jsonrpc/plugin-host"
import { Message } from "../../jsonrpc/types"
import { MergeStates, OpenApiTypes } from "../rule"
import { DescriptionMustNotBeNodeName } from "../rules/DescriptionMustNotBeNodeName"
import { PageableOperation } from "../rules/PageableOperation"
import { UniqueXmsEnumName } from "../rules/UniqueXmsEnumName"
import { assertValidationRuleCount, collectTestMessagesFromValidator } from "./utilities/tests-helper"

@suite
class CompositeAzureTests {
  @test public async "description should not be property name"() {
    const fileName: string = "DescriptionSameAsPropertyName.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.composed)
    assertValidationRuleCount(messages, DescriptionMustNotBeNodeName, 2)
  }

  @test public async "operations returning a model including an array might be pageable (sad path)"() {
    const fileName: string = "PageableOperation.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.composed)
    assertValidationRuleCount(messages, PageableOperation, 1)
  }

  @test public async "operations returning a model including an array might be pageable (happy path)"() {
    const fileName: string = "happyPath/PageableOperation.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.composed)
    assertValidationRuleCount(messages, PageableOperation, 0)
  }

  @test public async "extensions x-ms-enum must not have duplicate name"() {
    const fileName = "XmsEnumWithDuplicateName.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.composed)
    assertValidationRuleCount(messages, UniqueXmsEnumName, 1)
    assert.deepEqual(messages.length, 1)
  }
}
