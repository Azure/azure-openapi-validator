/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { safeLoad } from "js-yaml"
import { only, skip, slow, suite, test, timeout } from "mocha-typescript"
import { run } from "../../azure-openapi-validator"
import { AutoRestPluginHost } from "../../jsonrpc/plugin-host"
import { Message } from "../../jsonrpc/types"
import { MergeStates, OpenApiTypes } from "../rule"
import { AvoidEmptyResponseSchema } from "../rules/AvoidEmptyResponseSchema"
import { ControlCharactersAreNotAllowed } from "../rules/ControlCharactersAreNotAllowed"
import { DefaultErrorResponseSchema } from "../rules/DefaultErrorResponseSchema"
import { DeprecatedXmsCodeGenerationSetting } from "../rules/DeprecatedXmsCodeGenerationSetting"
import { EnumMustHaveType } from "../rules/EnumMustHaveType"
import { EnumMustNotHaveEmptyValue } from "../rules/EnumMustNotHaveEmptyValue"
import { EnumUniqueValue } from "../rules/EnumUniqueValue"
import { LicenseHeaderMustNotBeSpecified } from "../rules/LicenseHeaderMustNotBeSpecified"
import { OperationIdRequired } from "../rules/OperationIdRequired"
import { PostOperationIdContainsUrlVerb } from "../rules/PostOperationIdContainsUrlVerb"
import { PathResourceProviderNamePascalCase } from "./../rules/PathResourceProviderNamePascalCase"
import { PathResourceTypeNameCamelCase } from "./../rules/PathResourceTypeNameCamelCase"
import { assertValidationRuleCount, collectTestMessagesFromValidator } from "./utilities/tests-helper"

import * as assert from "assert"

@suite
class IndividualAzureTests {
  @test public async "control characters not allowed test"() {
    const fileName: string = "ContainsControlCharacters.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual)
    assertValidationRuleCount(messages, ControlCharactersAreNotAllowed, 2)
  }

  @test public async "post operation id must contain Url verb"() {
    const fileName = "PostOperationIdWithoutUrlVerb.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual)
    assertValidationRuleCount(messages, PostOperationIdContainsUrlVerb, 1)
    assert(
      messages[0].Text === "OperationId should contain the verb: 'invoke' in:'simpleManualTrigger_call'. Consider updating the operationId"
    )
  }
  @test
  public async "info section with x-ms-code-generation-settings must not contain a header"() {
    const fileName = "InfoWithLicenseHeader.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual)
    assertValidationRuleCount(messages, LicenseHeaderMustNotBeSpecified, 1)
  }

  @test
  public async "path resource provider name use pascal case eg: Microsoft.Insight"() {
    const fileName = "PathResourceProviderNamePascalCase.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual)
    assertValidationRuleCount(messages, PathResourceProviderNamePascalCase, 1)
  }

  @test public async "OperationId Required"() {
    const fileName = "OperationIdMissed.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual)
    assertValidationRuleCount(messages, OperationIdRequired, 2)
  }

  @test public async "Enum must have type"() {
    const fileName = "EnumMustHaveType.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual)
    assertValidationRuleCount(messages, EnumMustHaveType, 2)
  }

  @test public async "Enum unique value"() {
    const fileName = "EnumUniqueValue.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual)
    assertValidationRuleCount(messages, EnumUniqueValue, 1)
  }

  @test
  public async "path resource type name use camel case eg: proactiveDetectionConfigs"() {
    const fileName = "PathResourceTypeNameCamelCase.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual)
    assertValidationRuleCount(messages, PathResourceTypeNameCamelCase, 1)
  }
  @test public async "Enum must not have empty value"() {
    const fileName = "EnumMustNotHaveEmptyValue.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual)
    assertValidationRuleCount(messages, EnumMustNotHaveEmptyValue, 1)
  }

  @test public async "Must not have empty response schema"() {
    const fileName = "EmptyResponseSchema.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual)
    assertValidationRuleCount(messages, AvoidEmptyResponseSchema, 1)
  }

  @test public async "x-ms-code-generation-settings depreated"() {
    const fileName = "InfoWithxmsCodeGenerationSetting.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual)
    assertValidationRuleCount(messages, DeprecatedXmsCodeGenerationSetting, 1)
  }

  @test public async "default response schema correspond to document"() {
    const fileName = "DefaultResponseSchemaMatch.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual)
    assertValidationRuleCount(messages, DefaultErrorResponseSchema, 0)
  }

  @test public async "default response schema does not correspond to document"() {
    const fileName = "DefaultResponseSchemaDismatch.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual)
    assertValidationRuleCount(messages, DefaultErrorResponseSchema, 1)
  }
}
