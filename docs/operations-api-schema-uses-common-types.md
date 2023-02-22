# OperationsApiSchemaUsesCommonTypes

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Uri-V1-10

## Output Message

Not using common types json ref for operations API response

## Description

Response content of operations API must follow the error schema provided in the common types.

## Why the rule is important

To reduce duplication and maintain consistent structure in ARM specifications.

## How to fix

For any operations API paths, ensure to use the schema defined in the most recent [common types](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/common-types/resource-management/) types.json.
