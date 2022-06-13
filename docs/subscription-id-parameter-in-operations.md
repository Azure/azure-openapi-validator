# SubscriptionIdParameterInOperations

## Category

SDK Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

Parameter "subscriptionId" is not allowed in the operations section, define it in the global parameters section instead/Parameter "{0}" is referenced but not defined in the global parameters section of Service Definition

## Description

`subscriptionId` must not be an operation parameter and must be declared in the global parameters section.

## Why the rule is important

Per ARM guidelines, `subscriptionId` must be set as a property on the generated client instead of the method signature.

## How to fix the violation

Remove `subscriptionId` from the operation parameters and add it to the global parameters section if it doesn't exist there.
