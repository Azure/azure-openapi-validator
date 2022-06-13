# ParameterNotDefinedInGlobalParameters

## Category

SDK Warning

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

Parameter "{0}" is referenced but not defined in the global parameters section of Service Definition

## Description

Per ARM guidelines, if `subscriptionId` is used anywhere as a path parameter, it must always be defined as global parameter. `api-version` is almost always an input parameter in any ARM spec and must also be defined as a global parameter.

## Why the rule is important

To reduce duplication, maintain consistent structure in ARM specifications.

## Impact on generated code

`subscriptionId` and `api-version` are created as client properties in the generated code.

## How to fix the violation

Ensure `subscriptionId` and `api-version` are declared in the global parameters section of the document.
