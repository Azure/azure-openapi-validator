# DeleteInOperationName

## Category

SDK Warning

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

'DELETE' operation '{0}' should use method name 'Delete'. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change.

## Description

Verifies whether value for `operationId` is named as per ARM guidelines.

## Why the rule is important

Per ARM SDK guidelines, each 'DELETE' operation on a resource should have "delete" in the name. Guidelines are in place for a more consistent customer experience among ARM services SDKs.

## How to fix the violation

Make sure that `operationId` is in the form of `NOUN_Delete` or `Delete`.

## Impact on generated code

Operation name in the generated SDK will be named based on this.

## Examples

- Resources_Delete
- Delete
- StorageAccounts_delete
- delete
