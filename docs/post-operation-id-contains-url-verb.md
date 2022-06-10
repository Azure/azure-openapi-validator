# PostOperationIdContainsUrlVerb

## Category

SDK Warning

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

OperationId should contain the verb: '{0}' in:'{1}'

## Description

A POST operation's operationId should contain the verb indicated at the end of the corresponding url.

## Why the rule is important

The url indicates the action performed by it, the corresponding POST operationId should therefore contain this verb for semantic consistency.

## How to fix the violation

Ensure that the operationId for POST operation contains the verb indicated at the end of the url.

## Good Examples

Examples of url and corresponding POST operationIds:
* Url: /foo/{someResource}/activate
* OperationId: SomeResourceTypes_ActivateResource

## Bad Examples

Examples of url and corresponding POST operationIds:
* Url: /foo/{someResource}/activate
* OperationId: SomeResourceTypes_StartResource

## Impact on generated code

Method generated for the POST operation will be named as indicated after the '__underscore__'. For eg., OperationId *SomeResourceTypes_ActivateResource* will generate a method named *ActivateResource*
