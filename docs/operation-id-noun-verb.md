# OperationIdNounVerb

## Category

SDK Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

Per the Noun_Verb convention for Operation Ids, the noun '{0}' should not appear after the underscore.

## Description

OperationId should be of the form `Noun_Verb`.

## Impact on generated code

AutoRest breaks the operation id into its `Noun` and `Verb` where `Noun` becomes name of the operations class and the `Verb` becomes the name of the method in that class, i.e., operations are grouped inside the operations class named after the noun. Not adhering to this format can either cause AutoRest to fail or can generate semantically incorrect SDK.

## How to fix the violation

Ensure operationId is of the form `Noun_Verb`.

## Bad Example

```
Activate_Certificate
CertificateActivate
```

## Good Example

```
Certificate_Activate
```
