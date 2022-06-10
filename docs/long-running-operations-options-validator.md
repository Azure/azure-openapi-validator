# LongRunningOperationsOptionsValidator

## Category

SDK Warning

## Applies to

ARM and Data Plane OpenAPI(swagger) specs

## Output Message

A LRO Post operation with return schema must have "x-ms-long-running-operation-options" extension enabled.

## Description

This is a rule introduced to make the understanding of Long Running Operations more clear.

In case of LRO Post operation with return schema, it MAY be ambiguous for the SDK to understand automatically what the return schema is modeling. To avoid any confusion that would lead SDK to incorrectly instantiate the return type, service team needs to explain if the return schema is modeling a result from a "Location" header, or from an "Azure-AsyncOperation" header.

More details on LRO operation could be found [here](https://github.com/Azure/autorest/blob/main/docs/extensions/readme.md#x-ms-long-running-operation)

## How to fix the violation

For a Post LRO operation, add "x-ms-long-running-operation-options" extension with "final-state-via" property.

```json
"x-ms-long-running-operation-options": {
  "final-state-via": "location"
}
```

or

```json
"x-ms-long-running-operation-options": {
  "final-state-via": "azure-async-operation"
}
```
