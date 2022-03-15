import { UniqueXmsExample } from "./../legacyRules/UniqueXmsExample"
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as assert from "assert"
import { suite, test } from "mocha-typescript"
import { LintResultMessage } from "@microsoft.azure/openapi-validator-core"
import { OpenApiTypes } from "@microsoft.azure/openapi-validator-core"
import { AvoidEmptyResponseSchema } from "../legacyRules/AvoidEmptyResponseSchema"
import { ControlCharactersAreNotAllowed } from "../legacyRules/ControlCharactersAreNotAllowed"
import { DefaultErrorResponseSchema } from "../legacyRules/DefaultErrorResponseSchema"
import { DeleteOperationResponses } from "../legacyRules/DeleteOperationResponses"
import { DeprecatedXmsCodeGenerationSetting } from "../legacyRules/DeprecatedXmsCodeGenerationSetting"
import { EnumMustHaveType } from "../legacyRules/EnumMustHaveType"
import { EnumMustNotHaveEmptyValue } from "../legacyRules/EnumMustNotHaveEmptyValue"
import { EnumUniqueValue } from "../legacyRules/EnumUniqueValue"
import { IntegerTypeMustHaveFormat } from "../legacyRules/IntegerTypeMustHaveFormat"
import { LicenseHeaderMustNotBeSpecified } from "../legacyRules/LicenseHeaderMustNotBeSpecified"
import { OperationIdRequired } from "../legacyRules/OperationIdRequired"
import { PostOperationIdContainsUrlVerb } from "../legacyRules/PostOperationIdContainsUrlVerb"
import { PreviewVersionOverOneYear } from "../legacyRules/PreviewVersionOverOneYear"
import { RequiredDefaultResponse } from "../legacyRules/RequiredDefaultResponse"
import { Rpaas_CreateOperationAsyncResponseValidation } from "../legacyRules/Rpaas_CreateOperationAsyncResponseValidation"
import { ValidResponseCodeRequired } from "../legacyRules/ValidResponseCodeRequired"
import { XmsPageableMustHaveCorrespondingResponse } from "../legacyRules/XmsPageableMustHaveCorrespondingResponse"
import { PathResourceProviderNamePascalCase } from "./../legacyRules/PathResourceProviderNamePascalCase"
import { PathResourceTypeNameCamelCase } from "./../legacyRules/PathResourceTypeNameCamelCase"
import { assertValidationRuleCount, collectTestMessagesFromValidator } from "./utilities/tests-helper"
import { Rpaas_DeleteOperationAsyncResponseValidation } from "../legacyRules/Rpaas_DeleteOperationAsyncResponseValidation"
import { Rpaas_PostOperationAsyncResponseValidation } from "../legacyRules/Rpaas_PostOperationAsyncResponseValidation"
import { Rpaas_ResourceProvisioningState } from "../legacyRules/Rpaas_ResourceProvisioningState"
import { MissingXmsErrorResponse } from "../legacyRules/MissingXmsErrorResponse"
import { AzureResourceTagsSchema } from "../legacyRules/AzureResourceTagsSchema"
import { MissingTypeObject } from "../legacyRules/MissingTypeObject"
import { ParametersOrder } from "../legacyRules/ParametersOrder"
import { ExtensionResourcePathPattern } from "../legacyRules/ExtensionResourcePathPattern"
import { EnumMustRespectType } from "../legacyRules/EnumMustRespectType"
import { XmsEnumValidation } from "../legacyRules/XmsEnumValidation"
import { XmsIdentifierValidation } from "../legacyRules/XmsIdentifierValidation"

@suite
class IndividualAzureTests {
  @test public async "control characters not allowed test"() {
    const fileName: string = "ContainsControlCharacters.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm,ControlCharactersAreNotAllowed)
    assertValidationRuleCount(messages, ControlCharactersAreNotAllowed, 2)
  }

  @test public async "post operation id must contain Url verb"() {
    const fileName = "PostOperationIdWithoutUrlVerb.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      PostOperationIdContainsUrlVerb
    )
    assertValidationRuleCount(messages, PostOperationIdContainsUrlVerb, 1)
    assert.ok(
      messages[0].message ===
        "OperationId should contain the verb: 'invoke' in:'simpleManualTrigger_call'. Consider updating the operationId"
    )
  }
  @test
  public async "info section with x-ms-code-generation-settings must not contain a header"() {
    const fileName = "InfoWithLicenseHeader.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm,LicenseHeaderMustNotBeSpecified)
    assertValidationRuleCount(messages, LicenseHeaderMustNotBeSpecified, 1)
  }

  @test
  public async "path resource provider name use pascal case eg: Microsoft.Insight"() {
    const fileName = "PathResourceProviderNamePascalCase.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm,PathResourceProviderNamePascalCase)
    assertValidationRuleCount(messages, PathResourceProviderNamePascalCase, 1)
  }

  @test public async "OperationId Required"() {
    const fileName = "OperationIdMissed.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm,OperationIdRequired)
    assertValidationRuleCount(messages, OperationIdRequired, 2)
  }

  @test public async "Enum must have type"() {
    const fileName = "EnumMustHaveType.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm,EnumMustHaveType)
    assertValidationRuleCount(messages, EnumMustHaveType, 2)
  }

  @test public async "Enum unique value"() {
    const fileName = "EnumUniqueValue.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, EnumUniqueValue)
    assertValidationRuleCount(messages, EnumUniqueValue, 1)
  }

  @test public async "Enum must respect type"() {
    const fileName = "EnumMustRespectType.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, EnumMustRespectType)
    assertValidationRuleCount(messages, EnumMustRespectType, 4)
  }

  @test
  public async "path resource type name use camel case eg: proactiveDetectionConfigs"() {
    const fileName = "PathResourceTypeNameCamelCase.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      PathResourceTypeNameCamelCase
    )
    assertValidationRuleCount(messages, PathResourceTypeNameCamelCase, 1)
  }
  @test public async "Enum must not have empty value"() {
    const fileName = "EnumMustNotHaveEmptyValue.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, EnumMustNotHaveEmptyValue)
    assertValidationRuleCount(messages, EnumMustNotHaveEmptyValue, 1)
  }

  @test public async "Must not have empty response schema"() {
    const fileName = "EmptyResponseSchema.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, AvoidEmptyResponseSchema)
    assertValidationRuleCount(messages, AvoidEmptyResponseSchema, 1)
  }

  @test public async "x-ms-code-generation-settings depreated"() {
    const fileName = "InfoWithxmsCodeGenerationSetting.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      DeprecatedXmsCodeGenerationSetting
    )
    assertValidationRuleCount(messages, DeprecatedXmsCodeGenerationSetting, 1)
  }

  @test public async "default response schema correspond to document"() {
    const fileName = "DefaultResponseSchemaMatch.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, DefaultErrorResponseSchema)
    assertValidationRuleCount(messages, DefaultErrorResponseSchema, 0)
  }

  @test public async "default response schema does not correspond to document"() {
    const fileName = "DefaultResponseSchemaDismatch.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, DefaultErrorResponseSchema)
    assertValidationRuleCount(messages, DefaultErrorResponseSchema, 1)
  }

  @test public async "default response required"() {
    const fileName = "DefaultResponseMissed.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, RequiredDefaultResponse)
    assertValidationRuleCount(messages, RequiredDefaultResponse, 1)
  }

  @test public async "delete response required"() {
    const fileName = "DeleteResponseMissed.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, DeleteOperationResponses)
    assertValidationRuleCount(messages, DeleteOperationResponses, 1)
  }

  @test public async "interger must have format"() {
    const fileName = "IntegerWithoutFormat.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, IntegerTypeMustHaveFormat)
    assertValidationRuleCount(messages, IntegerTypeMustHaveFormat, 1)
  }

  @test public async "x-ms-pageable doesn't have corresponding property"() {
    const fileName = "PageableOperationWithoutCorrespondingProp.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      XmsPageableMustHaveCorrespondingResponse
    )
    assertValidationRuleCount(messages, XmsPageableMustHaveCorrespondingResponse, 1)
  }

  @test public async "x-ms-pageable have corresponding property"() {
    const fileName = "PageableOperationWithCorrespondingProp.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      XmsPageableMustHaveCorrespondingResponse
    )
    assertValidationRuleCount(messages, XmsPageableMustHaveCorrespondingResponse, 0)
  }

  @test public async "x-ms-pageable have null nextlink "() {
    const fileName = "PageableOperationWithNullNextLink.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      XmsPageableMustHaveCorrespondingResponse
    )
    assertValidationRuleCount(messages, XmsPageableMustHaveCorrespondingResponse, 0)
  }

  // Failure #1 : RPaaS async response supports 201 only. 202 is not supported.
  @test public async "Raas Put async operation doesn't support 202"() {
    const fileName = "RpaasPutAsyncOperationResponseCodeValidation.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      Rpaas_CreateOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, Rpaas_CreateOperationAsyncResponseValidation, 1)
  }

  // Failure #1 : 'x-ms-long-running-operation' is missing
  // Failure #2: 'x-ms-long-running-operation-options' is missing
  @test public async "Raas Put async operation missing x-ms* async extensions"() {
    const fileName = "RpaasPutAsyncOperationResponseMsCustomExtensionsMissing.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      Rpaas_CreateOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, Rpaas_CreateOperationAsyncResponseValidation, 2)
  }

  // Failure #1 : 'x-ms-long-running-operation' must be true as operation supports 201 (implies async)
  // Failure #2: 'final-state-via' must be set to 'azure-async-operation'
  @test public async "Raas Put async operation is tracked using Auzre-AsyncOperation header"() {
    const fileName = "RpaasPutAsyncOperationResponseFinalStateViaAzureAsync.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      Rpaas_CreateOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, Rpaas_CreateOperationAsyncResponseValidation, 2)
  }

  // Valid 201 response for RPaaS
  @test public async "Raas Put async operation is defined correctly"() {
    const fileName = "RpaasValidPutAsyncOperationResponse.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      Rpaas_CreateOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, Rpaas_CreateOperationAsyncResponseValidation, 0)
  }

  @test public async "Preview version over a year"() {
    const fileName = "PreviewVersionOverOneYear.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, PreviewVersionOverOneYear)
    assertValidationRuleCount(messages, PreviewVersionOverOneYear, 1)
  }

  // Failure #1 : RPaaS DELETE async response supports 202 only. 201 is not supported.
  @test public async "Raas DELETE async operation doesn't support 201"() {
    const fileName = "RpaasDeleteAsyncOperationResponseCodeValidation.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      Rpaas_DeleteOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, Rpaas_DeleteOperationAsyncResponseValidation, 1)
  }

  // Failure #1 : 'x-ms-long-running-operation' is missing
  // Failure #2: 'x-ms-long-running-operation-options' is missing
  @test public async "Raas DELETE async operation missing x-ms* async extensions"() {
    const fileName = "RpaasDeleteAsyncOperationResponseMsCustomExtensionsMissing.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      Rpaas_DeleteOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, Rpaas_DeleteOperationAsyncResponseValidation, 2)
  }

  // Failure #1 : 'x-ms-long-running-operation' must be true as operation supports 202 (implies async)
  // Failure #2: 'final-state-via' must be set to 'azure-async-operation'
  @test public async "Raas DELETE async operation is tracked using Auzre-AsyncOperation header"() {
    const fileName = "RpaasDeleteAsyncOperationResponseFinalStateViaLocation.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      Rpaas_DeleteOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, Rpaas_DeleteOperationAsyncResponseValidation, 2)
  }

  // Valid 202 response for DELETE operation in RPaaS
  @test public async "Raas DELETE async operation is defined correctly"() {
    const fileName = "RpaasValidDeleteAsyncOperationResponse.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      Rpaas_DeleteOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, Rpaas_DeleteOperationAsyncResponseValidation, 0)
  }

  // Failure #1 : RPaaS POST async response supports 202 only. 201 is not supported.
  @test public async "Raas POST async operation doesn't support 201"() {
    const fileName = "RpaasPostAsyncOperationResponseCodeValidation.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      Rpaas_PostOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, Rpaas_PostOperationAsyncResponseValidation, 1)
  }

  // Failure #1 : 'x-ms-long-running-operation' is missing
  // Failure #2: 'x-ms-long-running-operation-options' is missing
  @test public async "Raas POST async operation missing x-ms* async extensions"() {
    const fileName = "RpaasPostAsyncOperationResponseMsCustomExtensionsMissing.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      Rpaas_PostOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, Rpaas_PostOperationAsyncResponseValidation, 2)
  }

  // Failure #1 : 'x-ms-long-running-operation' must be true as operation supports 202 (implies async)
  // Failure #2: 'final-state-via' must be set to 'azure-async-operation'
  @test public async "Raas POST async operation is tracked using Auzre-AsyncOperation header"() {
    const fileName = "RpaasPostAsyncOperationResponseFinalStateViaLocation.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      Rpaas_PostOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, Rpaas_PostOperationAsyncResponseValidation, 2)
  }

  // Valid 202 response for POST operation in RPaaS
  @test public async "Raas POST async operation is defined correctly"() {
    const fileName = "RpaasValidPostAsyncOperationResponse.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      Rpaas_PostOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, Rpaas_PostOperationAsyncResponseValidation, 0)
  }

  @test public async "Raas resource is defined with empty properties"() {
    const fileName = "RpaasResourceWithEmptyPropertiesBag.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      Rpaas_ResourceProvisioningState
    )
    assertValidationRuleCount(messages, Rpaas_ResourceProvisioningState, 1)
  }

  @test public async "Raas resource is defined with provisioning properties"() {
    const fileName = "RpaasResourceWithProvisioningState.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      Rpaas_ResourceProvisioningState
    )
    assertValidationRuleCount(messages, Rpaas_ResourceProvisioningState, 0)
  }

  @test public async "only has default response"() {
    const fileName = "OnlyDefaultResponseSchema.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, ValidResponseCodeRequired)
    assertValidationRuleCount(messages, ValidResponseCodeRequired, 1)
  }

  @test public async "not only has default response"() {
    const fileName = "NotOnlyDefaultResponseSchema.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, ValidResponseCodeRequired)
    assertValidationRuleCount(messages, ValidResponseCodeRequired, 0)
  }

  @test public async "resource tag meet common type"() {
    const filename: string = "ResourceWithTag.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(filename, OpenApiTypes.arm, AzureResourceTagsSchema)
    assertValidationRuleCount(messages, AzureResourceTagsSchema, 1)
  }

  @test public async "missing x-ms-error-response"() {
    const fileName = "ErrorResponseMissing.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MissingXmsErrorResponse)
    assertValidationRuleCount(messages, MissingXmsErrorResponse, 2)
  }

  @test public async "missing type:object"() {
    const fileName = "missingTypeObject.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MissingTypeObject)
    assertValidationRuleCount(messages, MissingTypeObject, 9)
  }

  @test public async "parameter order not match"() {
    const fileName = "ParameterOrderNotMatchPath.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, ParametersOrder)
    assertValidationRuleCount(messages, ParametersOrder, 1)
  }

  @test public async "rpaas extension resource "() {
    const fileName = "RPaaSExtensionResource.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      ExtensionResourcePathPattern
    )
    assertValidationRuleCount(messages, ExtensionResourcePathPattern, 1)
  }

  @test public async "x-ms-enum absent "() {
    const fileName = "XmsEnumAbsent.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, XmsEnumValidation)
    assertValidationRuleCount(messages, XmsEnumValidation, 2)
  }

  @test public async "no password in model/property name"() {
    const fileName = "HasPassword.json"
    const ruleName = "noPasswordInPropertyName"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 1)
  }
  @test public async "x-ms-identifiers missing"() {
    const fileName = "XmsIdentifiers.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, XmsIdentifierValidation)
    assertValidationRuleCount(messages, XmsIdentifierValidation, 3)
  }
}
