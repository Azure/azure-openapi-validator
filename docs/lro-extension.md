# LroExtension

## Category

ARM & Data Plane Error

## Applies to

ARM & Data Plane OpenAPI specs

## Related ARM Guideline Code

- RPC-Post-V1-09

## Description

Operations with a 202 response should specify `x-ms-long-running-operation: true`. 
GET operation is excluded from the validation as GET will have 202 only if it is a polling action & hence x-ms-long-running-operation wouldn't be defined

## How to fix the violation

Add the `x-ms-long-running-operation: true` extension to PUT, PATCH, POST, DELETE operationS.

## Good Examples

```json
...
"/providers/Microsoft.Music/songs/{songName}" {
    "put" {
        "responses": {
            "202": {
                "description": "Accepted",
                "schema": {
                    "$ref": "#/definitions/SongName"
                }
            },
            "default": {
                "description": "Error response describing why the operation failed.",
                "schema": {
                    "$ref": "#/definitions/ErrorResponse"
                }
            }
        },
        "x-ms-long-running-operation": true,
    }
} 
...
```

## Bad Examples

```json
...
"/providers/Microsoft.Music/songs/{songName}" {
    "put" {
        "responses": {
            "202": {
                "description": "Accepted",
                "schema": {
                    "$ref": "#/definitions/SongName"
                }
            },
            "default": {
                "description": "Error response describing why the operation failed.",
                "schema": {
                    "$ref": "#/definitions/ErrorResponse"
                }
            }
        },
    }
} 
...
```