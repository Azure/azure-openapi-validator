# NoErrorCodeResponses

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Description

Responses must only be specified for success (`200`, `201`, `202`, `204`) response codes and the `default` response. Any errors must only be surfaced by using the `default` response.

## How to fix the violation

Remove all non-success response codes, and use the `default` response to specify any errors.
