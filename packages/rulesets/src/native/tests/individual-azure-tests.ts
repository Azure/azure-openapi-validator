/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as assert from "assert"
import { LintResultMessage, OpenApiTypes } from "@microsoft.azure/openapi-validator-core"

import { AvoidEmptyResponseSchema } from "../legacyRules/AvoidEmptyResponseSchema"
import { AzureResourceTagsSchema } from "../legacyRules/AzureResourceTagsSchema"
import { ControlCharactersAreNotAllowed } from "../legacyRules/ControlCharactersAreNotAllowed"
import { CreateOperationAsyncResponseValidation } from "../legacyRules/CreateOperationAsyncResponseValidation"
import { DefaultErrorResponseSchema } from "../legacyRules/DefaultErrorResponseSchema"
import { DeleteOperationAsyncResponseValidation } from "../legacyRules/DeleteOperationAsyncResponseValidation"
import { DeleteOperationResponses } from "../legacyRules/DeleteOperationResponses"
import { DeprecatedXmsCodeGenerationSetting } from "../legacyRules/DeprecatedXmsCodeGenerationSetting"
import { EnumMustHaveType } from "../legacyRules/EnumMustHaveType"
import { EnumMustNotHaveEmptyValue } from "../legacyRules/EnumMustNotHaveEmptyValue"
import { EnumMustRespectType } from "../legacyRules/EnumMustRespectType"
import { EnumUniqueValue } from "../legacyRules/EnumUniqueValue"
import { ExtensionResourcePathPattern } from "../legacyRules/ExtensionResourcePathPattern"
import { IntegerTypeMustHaveFormat } from "../legacyRules/IntegerTypeMustHaveFormat"
import { LicenseHeaderMustNotBeSpecified } from "../legacyRules/LicenseHeaderMustNotBeSpecified"
import { MissingTypeObject } from "../legacyRules/MissingTypeObject"
import { MissingXmsErrorResponse } from "../legacyRules/MissingXmsErrorResponse"
import { OperationIdRequired } from "../legacyRules/OperationIdRequired"
import { ParametersOrder } from "../legacyRules/ParametersOrder"
import { PostOperationAsyncResponseValidation } from "../legacyRules/PostOperationAsyncResponseValidation"
import { PostOperationIdContainsUrlVerb } from "../legacyRules/PostOperationIdContainsUrlVerb"
import { PreviewVersionOverOneYear } from "../legacyRules/PreviewVersionOverOneYear"
import { RequiredDefaultResponse } from "../legacyRules/RequiredDefaultResponse"
import { Rpaas_ResourceProvisioningState } from "../legacyRules/Rpaas_ResourceProvisioningState"
import { ValidResponseCodeRequired } from "../legacyRules/ValidResponseCodeRequired"
import { XmsEnumValidation } from "../legacyRules/XmsEnumValidation"
import { XmsIdentifierValidation } from "../legacyRules/XmsIdentifierValidation"
import { XmsPageableMustHaveCorrespondingResponse } from "../legacyRules/XmsPageableMustHaveCorrespondingResponse"
import { PathResourceProviderNamePascalCase } from "./../legacyRules/PathResourceProviderNamePascalCase"
import { PathResourceTypeNameCamelCase } from "./../legacyRules/PathResourceTypeNameCamelCase"
import { assertValidationRuleCount, collectTestMessagesFromValidator } from "./utilities/tests-helper"

describe("IndividualAzureTests", () => {
  test("control characters not allowed test", async () => {
    const fileName = "ContainsControlCharacters.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, ControlCharactersAreNotAllowed)
    assertValidationRuleCount(messages, ControlCharactersAreNotAllowed, 2)
  })

  test("post operation id must contain Url verb", async () => {
    const fileName = "PostOperationIdWithoutUrlVerb.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, PostOperationIdContainsUrlVerb)
    assertValidationRuleCount(messages, PostOperationIdContainsUrlVerb, 1)
    assert.ok(
      messages[0].message ===
        "OperationId should contain the verb: 'invoke' in:'simpleManualTrigger_call'. Consider updating the operationId"
    )
  })
  test("info section with x-ms-code-generation-settings must not contain a header", async () => {
    const fileName = "InfoWithLicenseHeader.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      LicenseHeaderMustNotBeSpecified
    )
    assertValidationRuleCount(messages, LicenseHeaderMustNotBeSpecified, 1)
  })

  test("path resource provider name use pascal case eg: Microsoft.Insight", async () => {
    const fileName = "PathResourceProviderNamePascalCase.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      PathResourceProviderNamePascalCase
    )
    assertValidationRuleCount(messages, PathResourceProviderNamePascalCase, 1)
  })

  test("OperationId Required", async () => {
    const fileName = "OperationIdMissed.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, OperationIdRequired)
    assertValidationRuleCount(messages, OperationIdRequired, 2)
  })

  test("Enum must have type", async () => {
    const fileName = "EnumMustHaveType.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, EnumMustHaveType)
    assertValidationRuleCount(messages, EnumMustHaveType, 2)
  })

  test("Enum unique value", async () => {
    const fileName = "EnumUniqueValue.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, EnumUniqueValue)
    assertValidationRuleCount(messages, EnumUniqueValue, 1)
  })

  test("Enum must respect type", async () => {
    const fileName = "EnumMustRespectType.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, EnumMustRespectType)
    assertValidationRuleCount(messages, EnumMustRespectType, 4)
  })

  test("path resource type name use camel case eg: proactiveDetectionConfigs", async () => {
    const fileName = "PathResourceTypeNameCamelCase.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, PathResourceTypeNameCamelCase)
    assertValidationRuleCount(messages, PathResourceTypeNameCamelCase, 1)
  })
  test("Enum must not have empty value", async () => {
    const fileName = "EnumMustNotHaveEmptyValue.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, EnumMustNotHaveEmptyValue)
    assertValidationRuleCount(messages, EnumMustNotHaveEmptyValue, 1)
  })

  test("Must not have empty response schema", async () => {
    const fileName = "EmptyResponseSchema.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, AvoidEmptyResponseSchema)
    assertValidationRuleCount(messages, AvoidEmptyResponseSchema, 1)
  })

  test("x-ms-code-generation-settings depreated", async () => {
    const fileName = "InfoWithxmsCodeGenerationSetting.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      DeprecatedXmsCodeGenerationSetting
    )
    assertValidationRuleCount(messages, DeprecatedXmsCodeGenerationSetting, 1)
  })

  test("default response schema correspond to document", async () => {
    const fileName = "DefaultResponseSchemaMatch.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, DefaultErrorResponseSchema)
    assertValidationRuleCount(messages, DefaultErrorResponseSchema, 0)
  })

  test("default response schema does not correspond to document", async () => {
    const fileName = "DefaultResponseSchemaDismatch.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, DefaultErrorResponseSchema)
    assertValidationRuleCount(messages, DefaultErrorResponseSchema, 1)
  })

  test("default response required", async () => {
    const fileName = "DefaultResponseMissed.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, RequiredDefaultResponse)
    assertValidationRuleCount(messages, RequiredDefaultResponse, 1)
  })

  test("delete response required", async () => {
    const fileName = "DeleteResponseMissed.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, DeleteOperationResponses)
    assertValidationRuleCount(messages, DeleteOperationResponses, 1)
  })

  test("interger must have format", async () => {
    const fileName = "IntegerWithoutFormat.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, IntegerTypeMustHaveFormat)
    assertValidationRuleCount(messages, IntegerTypeMustHaveFormat, 1)
  })

  test("x-ms-pageable doesn't have corresponding property", async () => {
    const fileName = "PageableOperationWithoutCorrespondingProp.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      XmsPageableMustHaveCorrespondingResponse
    )
    assertValidationRuleCount(messages, XmsPageableMustHaveCorrespondingResponse, 1)
  })

  test("x-ms-pageable have corresponding property", async () => {
    const fileName = "PageableOperationWithCorrespondingProp.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      XmsPageableMustHaveCorrespondingResponse
    )
    assertValidationRuleCount(messages, XmsPageableMustHaveCorrespondingResponse, 0)
  })

  test("x-ms-pageable have null nextlink", async () => {
    const fileName = "PageableOperationWithNullNextLink.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      XmsPageableMustHaveCorrespondingResponse
    )
    assertValidationRuleCount(messages, XmsPageableMustHaveCorrespondingResponse, 0)
  })

  // Failure #1 : RPaaS async response supports 201 only. 202 is not supported.
  test("Put async operation doesn't support 202", async () => {
    const fileName = "RpaasPutAsyncOperationResponseCodeValidation.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      CreateOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, CreateOperationAsyncResponseValidation, 1)
  })

  // Failure #1 : 'x-ms-long-running-operation' is missing
  // Failure #2: 'x-ms-long-running-operation-options' is missing
  test.skip("Put async operation missing x-ms* async extensions", async () => {
    const fileName = "RpaasPutAsyncOperationResponseMsCustomExtensionsMissing.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      CreateOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, CreateOperationAsyncResponseValidation, 2)
  })

  // Failure #1 : 'x-ms-long-running-operation' must be true as operation supports 201 (implies async)
  // Failure #2: 'final-state-via' must be set to 'azure-async-operation'
  test("Raas Put async operation is tracked using Auzre-AsyncOperation header", async () => {
    const fileName = "RpaasPutAsyncOperationResponseFinalStateViaAzureAsync.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      CreateOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, CreateOperationAsyncResponseValidation, 2)
  })

  // Valid 201 response for RPaaS
  test("Raas Put async operation is defined correctly", async () => {
    const fileName = "RpaasValidPutAsyncOperationResponse.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      CreateOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, CreateOperationAsyncResponseValidation, 0)
  })

  test("Preview version over a year", async () => {
    const fileName = "PreviewVersionOverOneYear.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, PreviewVersionOverOneYear)
    assertValidationRuleCount(messages, PreviewVersionOverOneYear, 1)
  })

  // Failure #1 : RPaaS DELETE async response supports 202 only. 201 is not supported.
  test("Raas DELETE async operation doesn't support 201", async () => {
    const fileName = "RpaasDeleteAsyncOperationResponseCodeValidation.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      DeleteOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, DeleteOperationAsyncResponseValidation, 1)
  })

  // Failure #1 : 'x-ms-long-running-operation' is missing
  // Failure #2: 'x-ms-long-running-operation-options' is missing
  test("Raas DELETE async operation missing x-ms* async extensions", async () => {
    const fileName = "RpaasDeleteAsyncOperationResponseMsCustomExtensionsMissing.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      DeleteOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, DeleteOperationAsyncResponseValidation, 2)
  })

  // Failure #1 : 'x-ms-long-running-operation' must be true as operation supports 202 (implies async)
  // Failure #2: 'final-state-via' must be set to 'azure-async-operation'
  test("Raas DELETE async operation is tracked using Auzre-AsyncOperation header", async () => {
    const fileName = "RpaasDeleteAsyncOperationResponseFinalStateViaLocation.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      DeleteOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, DeleteOperationAsyncResponseValidation, 2)
  })

  // Valid 202 response for DELETE operation in RPaaS
  test("Raas DELETE async operation is defined correctly", async () => {
    const fileName = "RpaasValidDeleteAsyncOperationResponse.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      DeleteOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, DeleteOperationAsyncResponseValidation, 0)
  })

  // Failure #1 : RPaaS POST async response supports 202 only. 201 is not supported.
  test("Raas POST async operation doesn't support 201", async () => {
    const fileName = "RpaasPostAsyncOperationResponseCodeValidation.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      PostOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, PostOperationAsyncResponseValidation, 1)
  })

  // Failure #1 : 'x-ms-long-running-operation' is missing
  // Failure #2: 'x-ms-long-running-operation-options' is missing
  test("Raas POST async operation missing x-ms* async extensions", async () => {
    const fileName = "RpaasPostAsyncOperationResponseMsCustomExtensionsMissing.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      PostOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, PostOperationAsyncResponseValidation, 2)
  })

  // Failure #1 : 'x-ms-long-running-operation' must be true as operation supports 202 (implies async)
  // Failure #2: 'final-state-via' must be set to 'azure-async-operation'
  test("Raas POST async operation is tracked using Auzre-AsyncOperation header", async () => {
    const fileName = "RpaasPostAsyncOperationResponseFinalStateViaLocation.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      PostOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, PostOperationAsyncResponseValidation, 2)
  })

  // Valid 202 response for POST operation in RPaaS
  test("Raas POST async operation is defined correctly", async () => {
    const fileName = "RpaasValidPostAsyncOperationResponse.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      PostOperationAsyncResponseValidation
    )
    assertValidationRuleCount(messages, PostOperationAsyncResponseValidation, 0)
  })

  test("Raas resource is defined with empty properties", async () => {
    const fileName = "RpaasResourceWithEmptyPropertiesBag.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      Rpaas_ResourceProvisioningState
    )
    assertValidationRuleCount(messages, Rpaas_ResourceProvisioningState, 1)
  })

  test("Raas resource is defined with provisioning properties", async () => {
    const fileName = "RpaasResourceWithProvisioningState.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.rpaas,
      Rpaas_ResourceProvisioningState
    )
    assertValidationRuleCount(messages, Rpaas_ResourceProvisioningState, 0)
  })

  test("only has default response", async () => {
    const fileName = "OnlyDefaultResponseSchema.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, ValidResponseCodeRequired)
    assertValidationRuleCount(messages, ValidResponseCodeRequired, 1)
  })

  test("not only has default response", async () => {
    const fileName = "NotOnlyDefaultResponseSchema.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, ValidResponseCodeRequired)
    assertValidationRuleCount(messages, ValidResponseCodeRequired, 0)
  })

  test("resource tag meet common type", async () => {
    const filename = "ResourceWithTag.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(filename, OpenApiTypes.arm, AzureResourceTagsSchema)
    assertValidationRuleCount(messages, AzureResourceTagsSchema, 1)
  })

  test("missing x-ms-error-response", async () => {
    const fileName = "ErrorResponseMissing.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MissingXmsErrorResponse)
    assertValidationRuleCount(messages, MissingXmsErrorResponse, 2)
  })

  test("missing type:object", async () => {
    const fileName = "missingTypeObject.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, MissingTypeObject)
    assertValidationRuleCount(messages, MissingTypeObject, 9)
  })

  test("parameter order not match", async () => {
    const fileName = "ParameterOrderNotMatchPath.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, ParametersOrder)
    assertValidationRuleCount(messages, ParametersOrder, 1)
  })

  test("rpaas extension resource", async () => {
    const fileName = "RPaaSExtensionResource.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.rpaas, ExtensionResourcePathPattern)
    assertValidationRuleCount(messages, ExtensionResourcePathPattern, 1)
  })

  test("x-ms-enum absent", async () => {
    const fileName = "XmsEnumAbsent.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, XmsEnumValidation)
    assertValidationRuleCount(messages, XmsEnumValidation, 2)
  })

  test("x-ms-identifiers missing", async () => {
    const fileName = "XmsIdentifiers.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, XmsIdentifierValidation)
    assertValidationRuleCount(messages, XmsIdentifierValidation, 2)
  })
  test("no put in for tracked resource", async () => {
    const fileNames = ["armResource/trackedResourceNoPut.json", "armResource/trackedResourceCommon.json"]
    const ruleName = "TrackedResourcesMustHavePut"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileNames, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 1)
  })

  test("no delete in for tracked resource", async () => {
    const fileNames = ["armResource/trackedResourceNoDelete.json", "armResource/trackedResourceCommon.json"]
    const ruleName = "AllResourcesMustHaveDelete"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileNames, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 1)
  })

  test("tracked resource beyonds third level", async () => {
    const fileNames = ["armResource/trackedResourceBeyondsThirdLevel.json", "armResource/trackedResourceCommon.json"]
    const ruleName = "TrackedResourceBeyondsThirdLevel"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileNames, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 1)
  })
})
