/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { only, skip, slow, suite, test, timeout } from "mocha-typescript"
import { LintResultMessage } from "@microsoft.azure/openapi-validator-core"
import { MergeStates, OpenApiTypes } from "@microsoft.azure/openapi-validator-core"
import { ArraySchemaMustHaveItems } from "../legacyRules/ArraySchemaMustHaveItems"
import { assertValidationRuleCount, collectTestMessagesFromValidator } from "./utilities/tests-helper"

@suite
class DefaultTests {
  @test public async "array schema must have items test"() {
    const fileName = "ArraySchemaWithoutItems.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.default,ArraySchemaMustHaveItems)
    assertValidationRuleCount(messages, ArraySchemaMustHaveItems, 1)
  }
}
