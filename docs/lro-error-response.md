# LroErrorContent

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

Error response content of long running operations must follow the error schema provided in the common types v2 and above.

## Description

Error response content of long running operations must follow the error schema provided in the common types v2 and above.

## Why the rule is important

To reduce duplication and maintain consistent structure in ARM specifications.

## How to fix the violation

For any error responses (4xx, 5xx, default) of long running operations having `'x-ms-long-running-operation': 'true'`, ensure to use the schema defined in the most recent [common types](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/common-types/resource-management/) types.json.
