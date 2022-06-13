# PageableRequires200Response

## Category

SDK Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

A response for the 200 HTTP status code must be defined to use x-ms-pageable.

## Description

Per definition of AutoRest [x-ms-pageable extension](https://github.com/Azure/autorest/blob/main/docs/extensions/readme.md#x-ms-pageable), the response schema must contain a 200 response schema.

## Why the rule is important

Pageable operation needs to have a response schema to be used by the SDK to serialize/deserialize the result.

## How to fix the violation

Add a 200 status code response with corresponding schema. Please refer the documentation of [x-ms-pageable](https://github.com/Azure/autorest/blob/main/docs/extensions/readme.md#x-ms-pageable). Note that this may require a service side change and may be a breaking change.

## Impact on generated code

Response schema is used to serialize/deserialize result, if 200 response is not specified, the generated SDK operation may not return the proper results, with the link its next page.

## Examples

Please refer the documentation of [x-ms-pageable](https://github.com/Azure/autorest/blob/main/docs/extensions/readme.md#x-ms-pageable).
