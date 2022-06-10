# InvalidVerbUsed

## Category

ARM Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

Permissible values for HTTP Verb are DELETE, GET, PUT, PATCH, HEAD, OPTIONS, POST, TRACE.

## Description

Each operation definition must have a HTTP verb and it must be DELETE/GET/PUT/PATCH/HEAD/OPTIONS/POST/TRACE.

## Why the rule is important

DELETE/GET/PUT/PATCH/HEAD/OPTIONS/POST/TRACE are the only valid HTTP operations.

## How to fix the violation

Provide a correct HTTP verb.
