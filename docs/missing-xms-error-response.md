# MissingXmsErrorResponse

## Category

SDK Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The response code {0} is defined without a x-ms-error-response.

## Description

If defines response code 4xx or 5xx , x-ms-error-response:true is required. There is one exception: a HEAD operation with 404 SHOULD have x-ms-error-response:false, as it is often used to check for existence of resources, the HEAD with 404 means the resource doesn’t exist.

## CreatedAt

February 23, 2021

## LastModifiedAt

February 23, 2021

## Why this rule is important

As some SDK may treat the 4xx or 5xx as exceptional code, if don't specified x-ms-error-response:true, the SDK will not handle the error schema correctly instead it will throw an exception.

## How to fix the violation

Add the x-ms-error-response:true for the error response code or remove it.

The following would be valid:

```json
 "responses": {
    "400": {
      "description": "Bad Request",
      "x-ms-error-response": true
    }
 }
```

The following would be invalid:

```json
 "responses": {
    "400": {
      "description": "Bad Request",
    }
 }
```
