# PathForTrackedResourceTypes

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Put-V1-01, RPC-Get-V1-11  

## Output Message

The path must be under a subscription and resource group for tracked resource types.

## Description

A tracked resource is supported only under a resource group scope, so all API paths for a tracked resource must contain the subscriptions and resourceGroups segments

## CreatedAt

June 21, 2022

## LastModifiedAt

June 21, 2022

## How to fix the violation

Add the missing resource group or subscriptionId segment to the uri.
