# GetInOperationName

## Category

SDK Warning

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

'GET' operation '{0}' should use method name 'Get' or Method name start with 'List'. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change.

## Description

Verifies whether value for `operationId` is named as per ARM guidelines.

## Why the rule is important

Per ARM SDK guidelines, each 'GET' operation on a resource should have "get" or "list" in the name. Guidelines are in place for a more consistent customer experience among ARM services SDKs

## How to fix the violation

Make sure that `operationId` is in the form of `NOUN_Get`, `NOUN_List`, `Get` or `List`.

## Impact on generated code

Operation name in the generated SDK will be named based on this.

## Examples

- Resources_Get
- Resources_List
- Get
- List
