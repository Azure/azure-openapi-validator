# NextLinkPropertyMustExist

## Category

SDK Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Get-V1-06

## Output Message

The property '{0}' specified by nextLinkName does not exist in the 200 response schema. Please, specify the name of the property that provides the nextLink. If the model does not have the nextLink property then specify null.

## Description

Per definition of AutoRest [x-ms-pageable extension](https://github.com/Azure/autorest/blob/main/docs/extensions/readme.md#x-ms-pageable), the property specified by nextLinkName must exist in the 200 response schema.

## Why the rule is important

Generated SDK may not work, as the nextLink won't be tied to a property of the response schema.

## How to fix the violation

Please refer the documentation of [x-ms-pageable](https://github.com/Azure/autorest/blob/main/docs/extensions/readme.md#x-ms-pageable).

## Impact on generated code

NextLink may be broken as property may not be found, paging may not work. Please note this may cause a breaking change in the generated SDK.

## Examples

Please refer the documentation of [x-ms-pageable](https://github.com/Azure/autorest/blob/main/docs/extensions/readme.md#x-ms-pageable) and [examples](https://github.com/Azure/azure-rest-api-specs/tree/master/documentation/x-ms-pageable).
