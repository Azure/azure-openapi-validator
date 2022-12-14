# ConsistentPatchProperties

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Patch-V1-03

## Output Message

The property '{propertyName}' in the request body either not apppear in the resource model or has the wrong level.

## Description

The properties in the patch body must be present in the resource model and follow json merge patch.

## CreatedAt

July 07, 2022

## LastModifiedAt

July 07, 2022

## How to fix the violation

If a resource is defined as below and the 'properties.propertyA' is patchable

```json
  FooResource: {
    "x-ms-azure-resource": true,
    allOf: [{ $ref: "#/definitions/Resource" }],
    properties: {
      properties: {
        type: "object",
        properties: {
          propertyA: {
            type: "string"
          }
        },
        ...
      },
    },
  },
```

then 'propertyA' must appear in the patch body with the same layout.

```json
  FooResourceUpdate: {
    type: "object",
    properties: {
      properties: {
        type: "object",
        properties: {
          propertyA: {
            type: "string"
          }
        }
      },
    },
  },
```
