# ParameterNotUsingCommonTypes

## Category

SDK Warning

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

Not using json ref for parameter "{0}" that is defined in common-types

## Description

Some commonly used parameters are defined in the common-types directory. These parameters should be referenced instead of explicitly redefining them.

## Why the rule is important

To reduce duplication, maintain consistent structure in ARM specifications.

## How to fix the violation

Ensure any paramaters that share a name with those in common-types are declared using a JSON reference (e.g. `"$ref": ./path/to/file#/parameters/CommonParameter`). Common-types parameters are defined in [here](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/common-types/resource-management/v4/types.json#L624).
