# GetResponseCodes

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Get-V1-01

## Description

The get operation should only return 200, also it should not be a long running operation.
In addition, it can return 202 only if it has location header defined (i.e, if it is a polling action).

## How to fix the violation

Remove all the other response codes except 200 and 202 with "Location" header defined
i.e, remove response codes 201, 202(if no "Location" header defined), 203, 204.

## Good Examples

```json
...
"/providers/Microsoft.Music/songs/{songName}" {
    "get" {
        "responses": {
            "200": {
                "description": "Successful completion of the asynchronous operation",
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
        }
    }
} 
...
```

```json
...
"/providers/Microsoft.Music/songOperations/{operationId}" {
    "get" {
        "responses": {
            "200": {
                "description": "Successful completion of the asynchronous operation",
                "schema": {
                    "$ref": "#/definitions/SongName"
                }
            },
            "202": {
                "description": "Accepted",
                "headers": {
                    "Location": {
                        "description": "The URL where the status of the asynchronous operation can be checked.",
                        "type": "string"
                    },
                },
            },
            "default": {
                "description": "Error response describing why the operation failed.",
                "schema": {
                    "$ref": "#/definitions/ErrorResponse"
                }
            }
        }
    }
} 
...
```

## Bad Examples

```json
...
"/providers/Microsoft.Music/songOperations/{operationId}" {
    "get" {
        "responses": {
            "200": {
                "description": "Successful completion of the asynchronous operation",
                "schema": {
                    "$ref": "#/definitions/SongName"
                }
            },
            "201": {
                "description": "Created",
            },
            "203": {
                "description": "Non authoritative",
            },
            "default": {
                "description": "Error response describing why the operation failed.",
                "schema": {
                    "$ref": "#/definitions/ErrorResponse"
                }
            }
        }
    }
} 
...
```

```json
...
"/providers/Microsoft.Music/songOperations/{operationId}" {
    "get" {
        "responses": {
            "202": {
                "description": "Accepted",
                "headers": {
                    "Location": {
                        "description": "The URL where the status of the asynchronous operation can be checked.",
                        "type": "string"
                    },
                },
            },
            "default": {
                "description": "Error response describing why the operation failed.",
                "schema": {
                    "$ref": "#/definitions/ErrorResponse"
                }
            }
        }
    }
} 
...
```