/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { only, skip, slow, suite, test, timeout } from "mocha-typescript"
import { run } from "../../azure-openapi-validator"
import { AutoRestPluginHost } from "../../jsonrpc/plugin-host"
import { Message } from "../../jsonrpc/types"
import { MergeStates, OpenApiTypes } from "../rule"
import { ArraySchemaMustHaveItems } from "../rules/ArraySchemaMustHaveItems"
import { assertValidationRuleCount, collectTestMessagesFromValidator } from "./utilities/tests-helper"

@suite
class DefaultTests {
  @test public async "array schema must have items test"() {
    const fileName = "ArraySchemaWithoutItems.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.default, MergeStates.composed)
    assertValidationRuleCount(messages, ArraySchemaMustHaveItems, 1)
  }
}
