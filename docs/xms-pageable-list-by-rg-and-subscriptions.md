# XmsPageableListByRGAndSubscriptions

## Category

SDK Warning

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

For the tracked resource '{0}', the x-ms-pageable extension values must be same for list by resource group and subscriptions operations.

## Description

When a tracked resource has list by resource group and subscription operations, the x-ms-pageable extension values must be same for both operations. A tracked resource is a resource with a 'location' property as required. If this rule flags a resource which does not have a 'location' property, then it might be a false positive.

## Why the rule is important

This will provide a consistent experience to the user, i.e. the user could expect the same behavior for both list by subscription and resource group. Please refer [here](https://github.com/Azure/autorest/tree/main/docs/extensions.md#x-ms-pageable) for details on the x-ms-pageable extension.

## How to fix the violation

Ensure that when a tracked resource has list by resource group and subscription operations, the x-ms-pageable extension values are same for both operations. This might involve a service side change which will result in a breaking change in the generated SDK.
