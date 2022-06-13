# OneUnderscoreInOperationId

## Category

SDK Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

Only 1 underscore is permitted in the operation id, following Noun_Verb conventions.

## Description

An operationId can have exactly one underscore, not adhering to it can cause errors in code generation.

## Why the rule is important

Given an operationId of the form `Noun_Verb`, AutoRest breaks the operation id into its `Noun` and `Verb` where `Noun` becomes name of the operations class and the `Verb` becomes the name of the method in that class. Not adhering to this format can cause AutoRest to fail during code generation.

## How to fix the violation

Ensure operationId is of the form `Noun_Verb` and contains exactly one underscore.

## Bad Example

```
Activate_Primary_Certificate
```

## Good Example

```
PrimaryCertificate_Activate
```
