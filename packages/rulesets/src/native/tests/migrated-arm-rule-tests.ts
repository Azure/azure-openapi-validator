/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { LintResultMessage, OpenApiTypes } from "@microsoft.azure/openapi-validator-core"

import { assertValidationRuleCount, collectTestMessagesFromValidator } from "./utilities/tests-helper"

describe("IndividualAzureTests", () => {
  test("body top level resource with extra", async () => {
    const fileNames = ["body-top-level-properties.json"]
    const ruleName = "BodyTopLevelProperties"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileNames, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 2)
  })

  test("body top level resource with real swagger", async () => {
    const fileNames = ["body-top-level-properties-real-swagger.json"]
    const ruleName = "BodyTopLevelProperties"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileNames, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 1)
  })

  test("body top level resource with managedByExtended should pass", async () => {
    const fileNames = ["body-top-level-properties-managedByExtended.json"]
    const ruleName = "BodyTopLevelProperties"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileNames, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 0)
  })

  test("tracked resource must have patch", async () => {
    const fileNames = ["armResource/trackedResourceNoPatch.json", "armResource/trackedResourceCommon.json"]
    const ruleName = "TrackedResourcePatchOperation"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileNames, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 1)
  })

  test("required properties in resource model", async () => {
    const fileNames = ["ext-resource-validation.json"]
    const ruleName = "RequiredPropertiesMissingInResourceModel"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileNames, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 4)
  })

  test("[positive] required properties in resource model with reference", async () => {
    const fileNames = ["ext-resource-validation-with-reference.json", "common-types/types.json"]
    const ruleName = "RequiredPropertiesMissingInResourceModel"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileNames, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 0)
  })

  test("operation api implementation", async () => {
    const fileNames = ["operations-api-validation.json"]
    const ruleName = "OperationsAPIImplementation"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileNames, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 1)
  })

  test("operation api implementation for valid operations api", async () => {
    const fileNames = ["operations-api-validation-no-errors.json"]
    const ruleName = "OperationsAPIImplementation"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileNames, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 0)
  })

  test("operation api implementation should have error for only a subscription level operations path", async () => {
    const fileNames = ["operations-api-validation-subscription-level.json"]
    const ruleName = "OperationsAPIImplementation"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileNames, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 1)
  })

  test("resource property bag multiple level violations", async () => {
    const fileNames = ["arm-resource-properties-bag-multiple-level-violations.json"]
    const ruleName = "ArmResourcePropertiesBag"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileNames, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 2)
  })

  test("resource property bag multiple violations", async () => {
    const fileNames = ["arm-resource-properties-bag-multiple-violations.json"]
    const ruleName = "ArmResourcePropertiesBag"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileNames, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 2)
  })

  test("resource property bag with tracked resource", async () => {
    const fileNames = ["arm-resource-properties-bag.json"]
    const ruleName = "ArmResourcePropertiesBag"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileNames, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 1)
  })

  test("resource property bag with reference and tracked resource", async () => {
    const fileNames = ["arm-resource-properties-bag-with-reference.json"]
    const ruleName = "ArmResourcePropertiesBag"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileNames, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 2)
  })

  test("resource property bag with proxy resource", async () => {
    const fileNames = ["arm-resource-properties-bag-proxy-resource.json"]
    const ruleName = "ArmResourcePropertiesBag"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileNames, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 1)
  })

  test("resource property bag with reference and proxy resource", async () => {
    const fileNames = ["arm-resource-properties-bag-with-reference-proxy-resources.json"]
    const ruleName = "ArmResourcePropertiesBag"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileNames, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 2)
  })

  test("resource property bag with multiple level reference", async () => {
    const fileNames = ["arm-resource-properties-bag-with-multiple-level-reference.json"]
    const ruleName = "ArmResourcePropertiesBag"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileNames, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 2)
  })

  test("provider namespace does not match file path", async () => {
    const fileNames = ["resource-manager/Microsoft.Network/network-interface-invalid.json"]
    const ruleName = "PathResourceProviderMatchNamespace"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileNames, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 1)
  })

  test("xms-pageable list by RG and subscription", async () => {
    const fileName = ["armResource/xmsPageableListByRGAndSubscription.json", "armResource/trackedResourceCommon.json"]
    const ruleName = "XmsPageableListByRGAndSubscriptions"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 1)
  })

  test("private link apis missing", async () => {
    const fileName = "PrivateLinkAPIsMissing.json"
    const ruleName = "ImplementPrivateEndpointAPIs"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, ruleName)
    assertValidationRuleCount(messages, ruleName, 1)
  })
})
