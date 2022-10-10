# SecurityDefinitionsStructure

## Category

SDK Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

Every OpenAPI(swagger) spec/configuration must have a security definitions section and it must adhere to the structure described [here](https://github.com/Azure/azure-openapi-validator/blob/main/docs/security-definitions-structure-validation.md)

## Description

Each OpenAPI json document must contain a security definitions section and the section must adhere to a certain format.

## Why the rule is important

Missing security definitions section does not describe the Azure services security model accurately. This is an ARM specific requirement which describes the security mechanism to access the services.

## How to fix the violation

Ensure that the document has a security definition section as described [here](https://github.com/Azure/azure-openapi-validator/blob/main/docs/resources/security-definitions-structure-validation.md)
