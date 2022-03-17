/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { only, skip, slow, suite, test, timeout } from "mocha-typescript"
import { LintResultMessage } from "@microsoft.azure/openapi-validator-core"
import { MergeStates, OpenApiTypes } from "@microsoft.azure/openapi-validator-core"
import { AllResourcesMustHaveGetOperation } from "../legacyRules/AllResourcesMustHaveGetOperation"
import { DescriptionMustNotBeNodeName } from "../legacyRules/DescriptionMustNotBeNodeName"
import { GetCollectionResponseSchema } from "../legacyRules/GetCollectionResponseSchema"
import { NestedResourcesMustHaveListOperation } from "../legacyRules/NestedResourcesMustHaveListOperation"
import { OperationsApiResponseSchema } from "../legacyRules/OperationsApiResponseSchema"
import { PageableOperation } from "../legacyRules/PageableOperation"
import { RequiredReadOnlySystemData } from "../legacyRules/RequiredReadOnlySystemData"
import { TopLevelResourcesListByResourceGroup } from "../legacyRules/TopLevelResourcesListByResourceGroup"
import { TopLevelResourcesListBySubscription } from "../legacyRules/TopLevelResourcesListBySubscription"
import { UniqueXmsEnumName } from "../legacyRules/UniqueXmsEnumName"
import { UniqueModelName } from "../legacyRules/UniqueModelName"
import { PrivateEndpointResourceSchemaValidation } from "../legacyRules/PrivateEndpointResourceSchemaValidation"
import { ImplementPrivateEndpointAPIs } from "../legacyRules/ImplementPrivateEndpointAPIs"
import { assertValidationRuleCount, collectTestMessagesFromValidator } from "./utilities/tests-helper"
import { UniqueXmsExample } from "../legacyRules/UniqueXmsExample"

@suite
class CompositeAzureTests {
  @test public async "description should not be property name"() {
    const fileName = "DescriptionSameAsPropertyName.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, DescriptionMustNotBeNodeName)
    assertValidationRuleCount(messages, DescriptionMustNotBeNodeName, 2)
  }

  @test public async "operations returning a model including an array might be pageable (sad path)"() {
    const fileName = "PageableOperation.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, PageableOperation)
    assertValidationRuleCount(messages, PageableOperation, 1)
  }

  @test public async "operations returning a model including an array might be pageable (happy path)"() {
    const fileName = "happyPath/PageableOperation.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, PageableOperation)
    assertValidationRuleCount(messages, PageableOperation, 0)
  }

  @test public async "extensions x-ms-enum must not have duplicate name"() {
    const fileName = "XmsEnumWithDuplicateName.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, UniqueXmsEnumName)
    assertValidationRuleCount(messages, UniqueXmsEnumName, 1)
  }

  @test public async "extensions x-ms-enum can have duplicate name with same enties (happy path)"() {
    const fileName = "happyPath/XmsEnumWithDuplicateNameAndSameEnties.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, UniqueXmsEnumName)
    assertValidationRuleCount(messages, UniqueXmsEnumName, 0)
  }

  @test public async "new apiVersion have operation without systemData"() {
    const fileName = "NewApiVersionHaveOperationWithoutSystemData.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, RequiredReadOnlySystemData)
    assertValidationRuleCount(messages, RequiredReadOnlySystemData, 2)
  }

  @test public async "all nested resources must have collection operation "() {
    const fileName = "armResource/compute.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      NestedResourcesMustHaveListOperation
    )
    assertValidationRuleCount(messages, NestedResourcesMustHaveListOperation, 1)
  }

  @test public async "operations api response must have specific schema"() {
    const fileName = "armResource/compute.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, OperationsApiResponseSchema)
    assertValidationRuleCount(messages, OperationsApiResponseSchema, 1)
  }
  @test public async "top level resources must list by resource group"() {
    const fileName = "armResource/compute.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      TopLevelResourcesListByResourceGroup
    )
    assertValidationRuleCount(messages, TopLevelResourcesListByResourceGroup, 1)
  }
  @test public async "top level resources must list by subscription"() {
    const fileName = "armResource/compute.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      TopLevelResourcesListBySubscription
    )
    assertValidationRuleCount(messages, TopLevelResourcesListBySubscription, 1)
  }

  @test public async "get collection response schema should match the ARM specification "() {
    const fileName = "armResource/cdn.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, GetCollectionResponseSchema)
    assertValidationRuleCount(messages, GetCollectionResponseSchema, 1)
  }

  @test public async "all resources must have get operation"() {
    const fileName = "armResource/cdn.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      AllResourcesMustHaveGetOperation
    )
    assertValidationRuleCount(messages, AllResourcesMustHaveGetOperation, 2)
  }

  @test public async "all resources must have get operation 2"() {
    const fileName = "armResource/security.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      AllResourcesMustHaveGetOperation
    )
    assertValidationRuleCount(messages, AllResourcesMustHaveGetOperation, 3)
  }

  @test public async "all resources must have get operation positive 1"() {
    const fileName = "armResource/firewallPolicy.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      AllResourcesMustHaveGetOperation
    )
    assertValidationRuleCount(messages, AllResourcesMustHaveGetOperation, 0)
  }

  @test public async "all resources must have get operation positive 2"() {
    const fileName = "armResource/containerservice.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      AllResourcesMustHaveGetOperation
    )
    assertValidationRuleCount(messages, AllResourcesMustHaveGetOperation, 0)
  }
  @test public async "all resources must have get operation positive 3"() {
    const fileName = "armResource/machinelearning.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      AllResourcesMustHaveGetOperation
    )
    assertValidationRuleCount(messages, AllResourcesMustHaveGetOperation, 0)
  }

  @test public async "all resources must have get operation positive 4"() {
    const fileName = "armResource/compute.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      AllResourcesMustHaveGetOperation
    )
    assertValidationRuleCount(messages, AllResourcesMustHaveGetOperation, 0)
  }

  @test public async "all resources must have get operation positive 5"() {
    const fileName = "happyPath/cluster.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      AllResourcesMustHaveGetOperation
    )
    assertValidationRuleCount(messages, AllResourcesMustHaveGetOperation, 0)
  }

  @test public async "unique model name"() {
    const fileName = "UniqueModelName.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, UniqueModelName)
    assertValidationRuleCount(messages, UniqueModelName, 1)
  }

  @test public async "private link apis missing"() {
    const fileName = "PrivateLinkAPIsMissing.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, ImplementPrivateEndpointAPIs)
    assertValidationRuleCount(messages, ImplementPrivateEndpointAPIs, 1)
  }

  @test public async "private link resource schema unmatch"() {
    const fileName = "PrivateLinkResourceUnMatch.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      PrivateEndpointResourceSchemaValidation
    )
    assertValidationRuleCount(messages, PrivateEndpointResourceSchemaValidation, 2)
  }

  @test public async "Unique x-ms-examples"() {
    const fileName = "UniqueXmsExample.json"
    const messages: LintResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, UniqueXmsExample)
    assertValidationRuleCount(messages, UniqueXmsExample, 1)
  }
}
