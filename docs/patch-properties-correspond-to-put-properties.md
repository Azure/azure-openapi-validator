# PatchPropertiesCorrespondToPutProperties

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Patch-V1-01

## Output Message

A patch request body must only contain properties present in the corresponding put request body, and must contain at least one property.

## Description

Validates that each patch request body contains properties present in the corresponding put request body, and must contain at least one property.

## How to fix the violation

Ensure that each patch request body contains properties present in the corresponding put request body, and must contain at least one property.

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
