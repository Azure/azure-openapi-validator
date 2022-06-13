# ListInOperationName

## Category

SDK Warning

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

Since operation '{0}' response has model definition '{1}', it should be of the form "_\_list_".

## Description

Verifies whether value for `operationId` is named as per ARM guidelines when response contains array of items.

## Why the rule is important

Per ARM SDK guidelines, each 'GET' operation on a resource should have "list" in the name when operation has [x-ms-pageable](https://github.com/Azure/autorest/tree/main/docs/extensions#x-ms-pageable) extension. Guidelines are in place for a more consistent customer experience among ARM services SDKs.

## How to fix the violation\*_: Make sure that `operationId` is in the form of `NOUN_List`, `NOUN_ListBy_

Make sure that `operationId` is in the form of `NOUN_List`, `NOUN_ListBy***` or `List`.

## Impact on generated code

Operation name in the generated SDK will be named based on this.

## Examples

- Resources_List
- Resources_ListBySubscriptions
- List
