# UniqueModelName

## Category

SDK Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The model name {0} is duplicated with {1} .

## Description

Do not rely on case sensitivity to differentiate models.

## CreatedAt

February 23, 2021

## LastModifiedAt

February 23, 2021

## Why this rule is important

In Python SDK, model names are converted to forms starting with capital. So all of "AAAA", "aaaa", "Aaaa" will be transformed to "Aaaa". So differentiating model names by their case sensitivities would break Python SDK generation.

## How to fix the violation

Rename the duplicate name .

The following would be invalid:

```json
"definitions": {
  "SKU": {
    "type": "string",
    "description": "SKU in request"
  },
  "sku": {
    "type": "string",
    "description": "SKU in response"
  }
}
```

The following would be valid:

```json
"definitions": {
  "requestSKU": {
    "type": "string",
    "description": "SKU in request"
  },
  "responseSKU": {
    "type": "string",
    "description": "SKU in response"
  }
}
```
