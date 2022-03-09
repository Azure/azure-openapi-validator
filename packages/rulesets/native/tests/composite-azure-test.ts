/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { only, skip, slow, suite, test, timeout } from "mocha-typescript"
import { LinterResultMessage } from "../types"
import { MergeStates, OpenApiTypes } from "../types"
import { AllResourcesMustHaveGetOperation } from "../rules/AllResourcesMustHaveGetOperation"
import { DescriptionMustNotBeNodeName } from "../rules/DescriptionMustNotBeNodeName"
import { GetCollectionResponseSchema } from "../rules/GetCollectionResponseSchema"
import { NestedResourcesMustHaveListOperation } from "../rules/NestedResourcesMustHaveListOperation"
import { OperationsApiResponseSchema } from "../rules/OperationsApiResponseSchema"
import { PageableOperation } from "../rules/PageableOperation"
import { RequiredReadOnlySystemData } from "../rules/RequiredReadOnlySystemData"
import { TopLevelResourcesListByResourceGroup } from "../rules/TopLevelResourcesListByResourceGroup"
import { TopLevelResourcesListBySubscription } from "../rules/TopLevelResourcesListBySubscription"
import { UniqueXmsEnumName } from "../rules/UniqueXmsEnumName"
import { UniqueModelName } from "../rules/UniqueModelName"
import { PrivateEndpointResourceSchemaValidation } from "../rules/PrivateEndpointResourceSchemaValidation"
import { ImplementPrivateEndpointAPIs } from "../rules/ImplementPrivateEndpointAPIs"
import { assertValidationRuleCount, collectTestMessagesFromValidator } from "./utilities/tests-helper"
import { UniqueXmsExample } from "../rules/UniqueXmsExample"

@suite
class CompositeAzureTests {
  @test public async "description should not be property name"() {
    const fileName: string = "DescriptionSameAsPropertyName.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, DescriptionMustNotBeNodeName)
    assertValidationRuleCount(messages, DescriptionMustNotBeNodeName, 2)
  }

  @test public async "operations returning a model including an array might be pageable (sad path)"() {
    const fileName: string = "PageableOperation.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, PageableOperation)
    assertValidationRuleCount(messages, PageableOperation, 1)
  }

  @test public async "operations returning a model including an array might be pageable (happy path)"() {
    const fileName: string = "happyPath/PageableOperation.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, PageableOperation)
    assertValidationRuleCount(messages, PageableOperation, 0)
  }

  @test public async "extensions x-ms-enum must not have duplicate name"() {
    const fileName = "XmsEnumWithDuplicateName.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, UniqueXmsEnumName)
    assertValidationRuleCount(messages, UniqueXmsEnumName, 1)
  }

  @test public async "extensions x-ms-enum can have duplicate name with same enties (happy path)"() {
    const fileName = "happyPath/XmsEnumWithDuplicateNameAndSameEnties.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, UniqueXmsEnumName)
    assertValidationRuleCount(messages, UniqueXmsEnumName, 0)
  }

  @test public async "new apiVersion have operation without systemData"() {
    const fileName = "NewApiVersionHaveOperationWithoutSystemData.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, RequiredReadOnlySystemData)
    assertValidationRuleCount(messages, RequiredReadOnlySystemData, 2)
  }

  @test public async "all nested resources must have collection operation "() {
    const fileName: string = "armResource/compute.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      NestedResourcesMustHaveListOperation
    )
    assertValidationRuleCount(messages, NestedResourcesMustHaveListOperation, 1)
  }

  @test public async "operations api response must have specific schema"() {
    const fileName: string = "armResource/compute.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, OperationsApiResponseSchema)
    assertValidationRuleCount(messages, OperationsApiResponseSchema, 1)
  }
  @test public async "top level resources must list by resource group"() {
    const fileName: string = "armResource/compute.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      TopLevelResourcesListByResourceGroup
    )
    assertValidationRuleCount(messages, TopLevelResourcesListByResourceGroup, 1)
  }
  @test public async "top level resources must list by subscription"() {
    const fileName: string = "armResource/compute.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      TopLevelResourcesListBySubscription
    )
    assertValidationRuleCount(messages, TopLevelResourcesListBySubscription, 1)
  }

  @test public async "get collection response schema should match the ARM specification "() {
    const fileName: string = "armResource/cdn.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, GetCollectionResponseSchema)
    assertValidationRuleCount(messages, GetCollectionResponseSchema, 1)
  }

  @test public async "all resources must have get operation"() {
    const fileName: string = "armResource/cdn.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      AllResourcesMustHaveGetOperation
    )
    assertValidationRuleCount(messages, AllResourcesMustHaveGetOperation, 2)
  }

  @test public async "all resources must have get operation 2"() {
    const fileName: string = "armResource/security.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      AllResourcesMustHaveGetOperation
    )
    assertValidationRuleCount(messages, AllResourcesMustHaveGetOperation, 3)
  }

  @test public async "all resources must have get operation positive 1"() {
    const fileName: string = "armResource/firewallPolicy.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      AllResourcesMustHaveGetOperation
    )
    assertValidationRuleCount(messages, AllResourcesMustHaveGetOperation, 0)
  }

  @test public async "all resources must have get operation positive 2"() {
    const fileName: string = "armResource/containerservice.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      AllResourcesMustHaveGetOperation
    )
    assertValidationRuleCount(messages, AllResourcesMustHaveGetOperation, 0)
  }
  @test public async "all resources must have get operation positive 3"() {
    const fileName: string = "armResource/machinelearning.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      AllResourcesMustHaveGetOperation
    )
    assertValidationRuleCount(messages, AllResourcesMustHaveGetOperation, 0)
  }

  @test public async "all resources must have get operation positive 4"() {
    const fileName: string = "armResource/compute.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      AllResourcesMustHaveGetOperation
    )
    assertValidationRuleCount(messages, AllResourcesMustHaveGetOperation, 0)
  }

  @test public async "all resources must have get operation positive 5"() {
    const fileName: string = "happyPath/cluster.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      AllResourcesMustHaveGetOperation
    )
    assertValidationRuleCount(messages, AllResourcesMustHaveGetOperation, 0)
  }

  @test public async "unique model name"() {
    const fileName: string = "UniqueModelName.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, UniqueModelName)
    assertValidationRuleCount(messages, UniqueModelName, 1)
  }

  @test public async "private link apis missing"() {
    const fileName: string = "PrivateLinkAPIsMissing.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, ImplementPrivateEndpointAPIs)
    assertValidationRuleCount(messages, ImplementPrivateEndpointAPIs, 1)
  }

  @test public async "private link resource schema unmatch"() {
    const fileName: string = "PrivateLinkResourceUnMatch.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(
      fileName,
      OpenApiTypes.arm,
      PrivateEndpointResourceSchemaValidation
    )
    assertValidationRuleCount(messages, PrivateEndpointResourceSchemaValidation, 2)
  }

  @test public async "Unique x-ms-examples"() {
    const fileName: string = "UniqueXmsExample.json"
    const messages: LinterResultMessage[] = await collectTestMessagesFromValidator(fileName, OpenApiTypes.arm, UniqueXmsExample)
    assertValidationRuleCount(messages, UniqueXmsExample, 1)
  }
}
