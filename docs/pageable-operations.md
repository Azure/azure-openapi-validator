# PageableOperations

## Description

This rule appears when you define a get operation, and its response schema has a property that is an array. The operation might be pageable.

## How to fix

Add an `x-ms-pageable` extension to the operation.

## Effect on generated code

### Before

#### Spec

```json5
…
    "paths": {
        "/plants": {
            "get": {
                "operationId": "Stuff_List",
                "responses": {
                    "200": {
                        "schema": {
                            "$ref": "#/definitions/StuffList"
                        }
                    }
                }
            }
        }
    }
…
    "definitions": {
        "StuffList": {
            "type": "object",
            "properties": {
                "value": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Stuff"
                    }
                },
                "nextLink": {
                    "type": "string",
                }
            }
        },
        "Stuff": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                },
            }
        }
    }
…
```

#### Generated code

```csharp
public static ProductResult GetMultiplePages(this IPagingOperations operations, string clientRequestId = default(string), PagingGetMultiplePagesOptions pagingGetMultiplePagesOptions = default(PagingGetMultiplePagesOptions))
{
    return operations.GetMultiplePagesAsync(clientRequestId, pagingGetMultiplePagesOptions).GetAwaiter().GetResult();
}
```

### After

#### Spec

```json5
…
    "paths": {
        "/plants": {
            "get": {
                "operationId": "Stuff_List",
                "responses": {
                    "200": {
                        "schema": {
                            "$ref": "#/definitions/StuffList"
                        }
                    }
                }
                "x-ms-pageable": {
                    "nextLinkName": "nextLink"
                }
            }
        }
    }
…
    "definitions": {
        "StuffList": {
            "type": "object",
            "properties": {
                "value": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Stuff"
                    }
                },
                "nextLink": {
                    "type": "string",
                }
            }
        },
        "Stuff": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                },
            }
        }
    }
…
```

#### Generated code

```csharp
public static IPage<Product> GetMultiplePages(this IPagingOperations operations, string clientRequestId = default(string), PagingGetMultiplePagesOptions pagingGetMultiplePagesOptions = default(PagingGetMultiplePagesOptions))
{
    return operations.GetMultiplePagesAsync(clientRequestId, pagingGetMultiplePagesOptions).GetAwaiter().GetResult();
}
…
public static IPage<Product> GetMultiplePagesNext(this IPagingOperations operations, string nextPageLink, string clientRequestId = default(string), PagingGetMultiplePagesOptions pagingGetMultiplePagesOptions = default(PagingGetMultiplePagesOptions))
{
    return operations.GetMultiplePagesNextAsync(nextPageLink, clientRequestId, pagingGetMultiplePagesOptions).GetAwaiter().GetResult();
}
}
```