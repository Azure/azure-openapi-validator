# LROStatusCodesReturnTypeSchema

## Category

SDK Warning

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

200/201 Responses of long running operations must have a schema definition for return type. OperationId: '{0}', Response code: '{1}'

## Description

The '200'/'201' responses of the long running operation must have a schema definition.

## Why the rule is important

Please refer [here](https://github.com/Azure/autorest/tree/main/docs/extensions.md#x-ms-long-running-operation) for details on the x-ms-long-running-operation. The '201' response code indicates 'Created' & '200' response code indicates 'Success'. In either case, it is logical for the response to be the same.

## How to fix the violation

Ensure that the '200'/'201' responses of the long running operation has a schema definition. This might involve a service side change which will result in a breaking change in the generated SDK.
