# PatchPropertiesCorrespondToPutProperties

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Patch-V1-01

## Output Message

A PATCH request body must only contain properties present in the corresponding PUT request body, and must contain at least one property.

## Description

Validates that each PATCH request body contains properties present in the corresponding PUT request body, and must contain at least one property.

## How to fix the violation

Ensure that each PATCH request body contains properties present in the corresponding PUT request body, and must contain at least one property.

## Good Example

```json
  "patch": {
    "parameters": [
      {
        "name": "foo_patch",
        "in": "body",
        "schema": {
          "$ref": "#/definitions/FooRequestParams",
        }
      }
    ]
  },
  "put": {
    "parameters": [
      {
        "name": "foo_put",
        "in": "body",
        "schema": {
          "$ref": "#/definitions/FooProps",
        }
      },
      {
        "name": "foo1_put",
        "in": "body",
        "schema": {
          "$ref": "#/definitions/FooRequestParams",
        }
      }
    ]
  }
```

## Bad Example

### Patch body parameters not found in put body

In the following example, the PATCH request has properties that are not present in the PUT request (#/definitions/FooRequestParams).

```json
  "patch": {
    "parameters": [
      {
        "name": "foo_patch",
        "in": "body",
        "schema": {
          "$ref": "#/definitions/FooRequestParams",
        }
      }
    ]
  },
  "put": {
    "parameters": [
      {
        "name": "foo_put",
        "in": "body",
        "schema": {
          "$ref": "#/definitions/FooProps",
        },
      },
      {
        "name": "foo1_put",
        "in": "body",
        "schema": {
          "$ref": "#/definitions/BarRequestParams",
        },
      }
    ]
  }
```

### Patch body empty

In the following example, the PATCH request has no body.

```json
  "patch": {
    "parameters": [
      {
        "name": "foo_patch",
        "in": "path",
      },
    ]
  },
  "put": {
    "parameters": [
      {
        "name": "foo_put",
        "in": "body",
        "schema": {
          "$ref": "#/definitions/FooProps",
        },
      },
      {
        "name": "foo1_put",
        "in": "body",
        "schema": {
          "$ref": "#/definitions/BarRequestParams",
        },
      }
    ]
  }
```

### Put body empty

In the following example, the PATCH request has non-empty body with an empty PUT body.

```json
 "patch": {
    "parameters": [
      {
        "name": "foo_patch",
        "in": "body",
        "schema": {
          "$ref": "#/definitions/FooRequestParams",
        },
      },
    ]
  },
  "put": {
    "parameters": [
      {
        "name": "foo_put",
        "in": "path",
        "schema": {
          "$ref": "#/definitions/FooProps",
        },
      }
    ]
  }
```
