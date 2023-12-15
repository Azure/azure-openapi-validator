# ProvisioningStateMustBeReadOnly

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Description

This is a rule introduced to validate if provisioningState property is set to readOnly.

## How to fix the violation

Set the `provisioningState` property `readOnly`, i.e, `"readOnly": true` should be added to "provisioningState" property.
Make sure to add the `"readOnly": true` to the actual "provisioningState" definition and not to the envelope property(i.e, property that references the actual definition)


## Bad example 1 

provisioningState without readOnly 

```json5
 "put": {
    "responses": {
      "200": {
        "description": "Success",
        "schema": {
          "$ref": "#/definitions/FooProps",
        },
      },
    }
 }
"definitions": {
    "FooProps": {
      "properties": {
        "provisioningState": {
          "type": "string",
          "description": "Provisioning state of the foo rule.",
          "enum": ["Creating", "Canceled", "Deleting", "Failed"],
        },
      },
    },
}
```

    
## Bad example 2 

provisioningState with readOnly defined in the envelope property and not in the actual definition

```json5
 "put": {
    "responses": {
      "200": {
        "description": "Success",
        "schema": {
          "$ref": "#/definitions/FooRule",
        },
      },
    }
 }
"definitions": {
   "ProvisioningState": {
      "type": "string",
      "enum": ["Succeeded", "Failed", "Canceled"],
      "x-ms-enum": {
        "name": "ProvisioningState",
        "modelAsString": true,
      },
    },
    "FooRule": {
      "type": "object",
      "properties": {
        "properties": {
          "$ref": "#/definitions/FooProps",
          "x-ms-client-flatten": true,
        },
      },
    },
    "FooProps": {
      "properties": {
        "provisioningState": {
        "$ref": "#/definitions/ProvisioningState",
        "readOnly": true,
        "type": "string",
        "description": "Provisioning state of the foo rule.",
        "enum": ["Creating", "Canceled", "Deleting", "Failed"],
        },
      },
    }
}
```

## Good example 1

provisioningState with readOnly defined

```json5
 "put": {
    "responses": {
      "200": {
        "description": "Success",
        "schema": {
          "$ref": "#/definitions/FooProps",
        },
      },
    }
 }
"definitions": {
    "FooProps": {
      "properties": {
        "provisioningState": {
          "type": "string",
          "readOnly": true,
          "description": "Provisioning state of the foo rule.",
          "enum": ["Creating", "Canceled", "Deleting", "Failed"],
        },
      },
    },
}
```

## Good example 2 

provisioningState with readOnly defined in the actual definition

```json5
 "put": {
    "responses": {
      "200": {
        "description": "Success",
        "schema": {
          "$ref": "#/definitions/FooRule",
        },
      },
    }
 }
"definitions": {
   "ProvisioningState": {
      "type": "string",
      "readOnly": true,
      "enum": ["Succeeded", "Failed", "Canceled"],
      "x-ms-enum": {
        "name": "ProvisioningState",
        "modelAsString": true,
      },
    },
    "FooRule": {
      "type": "object",
      "properties": {
        "properties": {
          "$ref": "#/definitions/FooProps",
          "x-ms-client-flatten": true,
        },
      },
    },
    "FooProps": {
      "properties": {
        "provisioningState": {
        "$ref": "#/definitions/ProvisioningState",
        "type": "string",
        "description": "Provisioning state of the foo rule.",
        "enum": ["Creating", "Canceled", "Deleting", "Failed"],
        },
      },
    }
}
```
