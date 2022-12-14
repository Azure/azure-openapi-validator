# LongRunningResponseStatusCode

## Category

SDK Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Async-V1-01

## Output Message

A '{0}' operation '{1}' with x-ms-long-running-operation extension must have a valid terminal success status code {2}.

## Description

For ARM spec, the allowed response status codes for a long DELETE operation are "200" & "204"; the allowed response status codes for a POST operation are "200", "201" ,"202", & "204"; the allowed response status codes for a PUT/PATCH operation are "200" & "201".
For Data plane spec, the allowed response status codes for a long DELETE operation are "200","202", & "204"; the allowed response status codes for a POST operation are "200", "201" ,"202", & "204"; the allowed response status codes for a PUT/PATCH operation are "200","201", & "202".

## Why the rule is important

This will ensure that the DELETE/POST/PUT operations are designed correctly.Please refer [here](https://github.com/Azure/autorest/tree/main/docs/extensions.md#x-ms-long-running-operation) for further details.

## How to fix the violation

Ensure that the DELETE/POST/PUT operations have the allowed response codes.
