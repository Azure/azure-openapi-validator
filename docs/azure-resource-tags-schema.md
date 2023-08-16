# AzureResourceTagsSchema

## Category

SDK Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The property tags in the resource "{0}" does not conform to the common type definition.

## Description

This rule is to check if the tags definition of a resource conforms to the common tags definition.

## CreatedAt

February 23, 2021

## LastModifiedAt

February 23, 2021

## Why this rule is important

It will block the SDK generation for Terraform, as it's only accepted that the Golang type for tags is map[string]\*string .

## How to fix the violation

Please reference to the common tags definition in [v2/types.json](https://github.com/Azure/azure-rest-api-specs/blob/0e18f46fd2c210f85b5ec0f9dd9be664242bee82/specification/common-types/resource-management/v2/types.json#L146).

The following would be invalid:

```json
"tags": {
  "type": "object",
  "description": "Resource Tags"
}
```

The following would be valid:

```json
"tags": {
  "type": "object",
  "additionalProperties": {
    "type": "string"
  },
  "x-ms-mutability": [
    "read",
    "create",
    "update"
  ],
  "description": "Resource Tags"
}
```
