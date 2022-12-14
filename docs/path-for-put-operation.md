# PathForPutOperation

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Put-V1-01

## Output Message

The path for 'put' operation must be under a subscription and resource group.

## Description

For a PUT operation, If a uri segment has subscription, it needs to have a resource group segment as well.

## CreatedAt

June 21, 2022

## LastModifiedAt

June 21, 2022

## How to fix the violation

Adding the missing resource group or subscriptionId segment to the uri.
