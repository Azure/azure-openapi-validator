/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { LintResultMessage } from "@microsoft.azure/openapi-validator-core"
import { OpenApiTypes } from "@microsoft.azure/openapi-validator-core"
import { ArraySchemaMustHaveItems } from "../legacyRules/ArraySchemaMustHaveItems"
import { assertValidationRuleCount, collectTestMessagesFromValidator } from "./utilities/tests-helper"

describe("DefaultTests",()=> {
 test( "array schema must have items test",async ()=> {
    const fileName = "ArraySchemaWithoutItems.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.default,ArraySchemaMustHaveItems)
    assertValidationRuleCount(messages, ArraySchemaMustHaveItems, 1)
  })
})
