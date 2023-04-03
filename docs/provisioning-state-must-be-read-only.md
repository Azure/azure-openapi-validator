# ProvisioningStateMustBeReadOnly

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

provisioningState property must be set to readOnly.

## Description

This is a rule introduced to validate if provisioningState property is set to readOnly or not.

## How to fix the violation

provisioningState property must be set to readOnly.
i.e, "readOnly": true
should be added to "provisioningState" property.
