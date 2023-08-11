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

For a operation, If the URI segment has a subscription, then the URI needs to have a resource group segment as well.

## CreatedAt

June 21, 2022

## LastModifiedAt

June 21, 2022

## How to fix the violation

Add the missing resource group or subscriptionId segment to the uri.
