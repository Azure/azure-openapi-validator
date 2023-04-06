# ProvisioningStateMustBeReadOnly

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

provisioningState property must be set to readOnly.

## Description

This is a rule introduced to validate if provisioningState property is set to readOnly.

## How to fix the violation

Set the `provisioningState` property `readOnly`.
I.e., `"readOnly": true`
should be added to "provisioningState" property.
