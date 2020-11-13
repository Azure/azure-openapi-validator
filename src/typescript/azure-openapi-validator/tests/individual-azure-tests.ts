/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as assert from "assert"
import { suite, test } from "mocha-typescript"
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
import { PreviewVersionOverOneYear } from "../rules/PreviewVersionOverOneYear"
import { RequiredDefaultResponse } from "../rules/RequiredDefaultResponse"
import { Rpaas_CreateOperationAsyncResponseValidation } from "../rules/Rpaas_CreateOperationAsyncResponseValidation"
import { XmsPageableMustHaveCorrespondingResponse } from "../rules/XmsPageableMustHaveCorrespondingResponse"
import { PathResourceProviderNamePascalCase } from "./../rules/PathResourceProviderNamePascalCase"
import { PathResourceTypeNameCamelCase } from "./../rules/PathResourceTypeNameCamelCase"
import { assertValidationRuleCount, collectTestMessagesFromValidator } from "./utilities/tests-helper"
import { Rpaas_DeleteOperationValidation } from "../rules/Rpaas_DeleteOperationValidation"
import { Rpaas_PostOperationAsyncResponseValidation } from "../rules/Rpaas_PostOperationAsyncResponseValidation"
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

  // Failure #1 : RPaaS async response supports 201 only. 202 is not supported.
  @test public async "Raas Put async operation doesn't support 202"() {
    const fileName = "RpaasPutAsyncOperationResponseCodeValidation.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.rpaas, MergeStates.individual)
    assertValidationRuleCount(messages, Rpaas_CreateOperationAsyncResponseValidation, 1)
  }

  // Failure #1 : 'x-ms-long-running-operation' is missing
  // Failure #2: 'x-ms-long-running-operation-options' is missing
  @test public async "Raas Put async operation missing x-ms* async extensions"() {
    const fileName = "RpaasPutAsyncOperationResponseMsCustomExtensionsMissing.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.rpaas, MergeStates.individual)
    assertValidationRuleCount(messages, Rpaas_CreateOperationAsyncResponseValidation, 2)
  }

  // Failure #1 : 'x-ms-long-running-operation' must be true as operation supports 201 (implies async)
  // Failure #2: 'final-state-via' must be set to 'azure-async-operation'
  @test public async "Raas Put async operation is tracked using Auzre-AsyncOperation header"() {
    const fileName = "RpaasPutAsyncOperationResponseFinalStateViaAzureAsync.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.rpaas, MergeStates.individual)
    assertValidationRuleCount(messages, Rpaas_CreateOperationAsyncResponseValidation, 2)
  }

  // Valid 201 response for RPaaS
  @test public async "Raas Put async operation is defined correctly"() {
    const fileName = "RpaasValidPutAsyncOperationResponse.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.rpaas, MergeStates.individual)
    assertValidationRuleCount(messages, Rpaas_CreateOperationAsyncResponseValidation, 0)
  }

  @test public async "Preview version over a year"() {
    const fileName = "PreviewVersionOverOneYear.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MergeStates.individual)
    assertValidationRuleCount(messages, PreviewVersionOverOneYear, 1)
  }

  // Failure #1 : RPaaS DELETE async response supports 202 only. 201 is not supported.
  @test public async "Raas DELETE async operation doesn't support 201"() {
    const fileName = "RpaasDeleteAsyncOperationResponseCodeValidation.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.rpaas, MergeStates.individual)
    assertValidationRuleCount(messages, Rpaas_DeleteOperationValidation, 1)
  }

  // Failure #1 : 'x-ms-long-running-operation' is missing
  // Failure #2: 'x-ms-long-running-operation-options' is missing
  @test public async "Raas DELETE async operation missing x-ms* async extensions"() {
    const fileName = "RpaasDeleteAsyncOperationResponseMsCustomExtensionsMissing.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.rpaas, MergeStates.individual)
    assertValidationRuleCount(messages, Rpaas_DeleteOperationValidation, 2)
  }

  // Failure #1 : 'x-ms-long-running-operation' must be true as operation supports 202 (implies async)
  // Failure #2: 'final-state-via' must be set to 'azure-async-operation'
  @test public async "Raas DELETE async operation is tracked using Auzre-AsyncOperation header"() {
    const fileName = "RpaasDeleteAsyncOperationResponseFinalStateViaLocation.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.rpaas, MergeStates.individual)
    assertValidationRuleCount(messages, Rpaas_DeleteOperationValidation, 2)
  }

  // Valid 202 response for DELETE operation in RPaaS
  @test public async "Raas DELETE async operation is defined correctly"() {
    const fileName = "RpaasValidDeleteAsyncOperationResponse.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.rpaas, MergeStates.individual)
    assertValidationRuleCount(messages, Rpaas_DeleteOperationValidation, 0)
  }

  // [RPaaS] DELETE response must contain 200 
  @test public async "Raas DELETE operation response must have 200"() {
    const fileName = "RpaasDeleteResponseCode200RequiredValidation.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.rpaas, MergeStates.individual)
    assertValidationRuleCount(messages, Rpaas_DeleteOperationValidation, 1)
  }

  // [RPaaS] DELETE response must contain 204
  @test public async "Raas DELETE operation response must have 204"() {
    const fileName = "RpaasDeleteResponseCode204RequiredValidation.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.rpaas, MergeStates.individual)
    assertValidationRuleCount(messages, Rpaas_DeleteOperationValidation, 1)
  }

  // Failure #1 : RPaaS POST async response supports 202 only. 201 is not supported.
  @test public async "Raas POST async operation doesn't support 201"() {
    const fileName = "RpaasPostAsyncOperationResponseCodeValidation.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.rpaas, MergeStates.individual)
    assertValidationRuleCount(messages, Rpaas_PostOperationAsyncResponseValidation, 1)
  }

  // Failure #1 : 'x-ms-long-running-operation' is missing
  // Failure #2: 'x-ms-long-running-operation-options' is missing
  @test public async "Raas POST async operation missing x-ms* async extensions"() {
    const fileName = "RpaasPostAsyncOperationResponseMsCustomExtensionsMissing.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.rpaas, MergeStates.individual)
    assertValidationRuleCount(messages, Rpaas_PostOperationAsyncResponseValidation, 2)
  }

  // Failure #1 : 'x-ms-long-running-operation' must be true as operation supports 202 (implies async)
  // Failure #2: 'final-state-via' must be set to 'azure-async-operation'
  @test public async "Raas POST async operation is tracked using Auzre-AsyncOperation header"() {
    const fileName = "RpaasPostAsyncOperationResponseFinalStateViaLocation.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.rpaas, MergeStates.individual)
    assertValidationRuleCount(messages, Rpaas_PostOperationAsyncResponseValidation, 2)
  }

  // Valid 202 response for POST operation in RPaaS
  @test public async "Raas POST async operation is defined correctly"() {
    const fileName = "RpaasValidPostAsyncOperationResponse.json"
    const messages: Message[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.rpaas, MergeStates.individual)
    assertValidationRuleCount(messages, Rpaas_PostOperationAsyncResponseValidation, 0)
  }
}
