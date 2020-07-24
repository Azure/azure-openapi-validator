/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as assert from "assert"
import { safeLoad } from "js-yaml"
import { only, skip, slow, suite, test, timeout } from "mocha-typescript"
import { run } from "../../azure-openapi-validator"
import { AutoRestPluginHost } from "../../jsonrpc/plugin-host"
import { Message } from "../../jsonrpc/types"
import { MergeStates, OpenApiTypes } from "../rule"
import { AvoidEmptyResponseSchema } from "../rules/AvoidEmptyResponseSchema"
import { ControlCharactersAreNotAllowed } from "../rules/ControlCharactersAreNotAllowed"
import { DefaultErrorResponseSchema } from "../rules/DefaultErrorResponseSchema"
import { DeleteOperationResponses } from "../rules/DeleteOperationResponses"
import { DeprecatedXmsCodeGenerationSetting } from "../rules/DeprecatedXmsCodeGenerationSetting"
import { EnumMustHaveType } from "../rules/EnumMustHaveType"
import { EnumMustNotHaveEmptyValue } from "../rules/EnumMustNotHaveEmptyValue"
import { EnumUniqueValue } from "../rules/EnumUniqueValue"
import { IntegerTypeMustHaveFormat } from "../rules/IntegerTypeMustHaveFormat"
import { LicenseHeaderMustNotBeSpecified } from "../rules/LicenseHeaderMustNotBeSpecified"
import { OperationIdRequired } from "../rules/OperationIdRequired"
import { PostOperationIdContainsUrlVerb } from "../rules/PostOperationIdContainsUrlVerb"
import { RequiredDefaultResponse } from "../rules/RequiredDefaultResponse"
import { XmsPageableMustHaveCorrespondingResponse } from "../rules/XmsPageableMustHaveCorrespondingResponse"
import { PathResourceProviderNamePascalCase } from "./../rules/PathResourceProviderNamePascalCase"
import { PathResourceTypeNameCamelCase } from "./../rules/PathResourceTypeNameCamelCase"
import { assertValidationRuleCount, collectTestMessagesFromValidator } from "./utilities/tests-helper"
@suite
class IndividualAzureTests {
  @test public async "all resources must have get operation 7"() {
    const fileName: string = "armResource/containerservice.json"
    try {
      const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.composed)
      assertValidationRuleCount(messages, ControlCharactersAreNotAllowed, 4)
    } catch (e) {
      console.log(e)
    }
  }

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

  @test public async "default response required"() {
    const fileName = "DefaultResponseMissed.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual)
    assertValidationRuleCount(messages, RequiredDefaultResponse, 1)
  }

  @test public async "delete response required"() {
    const fileName = "DeleteResponseMissed.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual)
    assertValidationRuleCount(messages, DeleteOperationResponses, 1)
  }

  @test public async "interger must have format"() {
    const fileName = "IntegerWithoutFormat.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual)
    assertValidationRuleCount(messages, IntegerTypeMustHaveFormat, 1)
  }

  @test public async "x-ms-pageable doesn't have corresponding property"() {
    const fileName = "PageableOperationWithoutCorrespondingProp.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual)
    assertValidationRuleCount(messages, XmsPageableMustHaveCorrespondingResponse, 1)
  }

  @test public async "x-ms-pageable have corresponding property"() {
    const fileName = "PageableOperationWithCorrespondingProp.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual)
    assertValidationRuleCount(messages, XmsPageableMustHaveCorrespondingResponse, 0)
  }

  @test public async "x-ms-pageable have null nextlink "() {
    const fileName = "PageableOperationWithNullNextLink.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual)
    assertValidationRuleCount(messages, XmsPageableMustHaveCorrespondingResponse, 0)
  }
}
