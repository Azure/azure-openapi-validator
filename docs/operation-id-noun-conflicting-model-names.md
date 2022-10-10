# OperationIdNounConflictingModelNames

## Category

SDK Warning

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

OperationId has a noun that conflicts with one of the model names in definitions section. The model name will be disambiguated to '{0}Model'. Consider using the plural form of '{1}' to avoid this. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change.

## Description

The first part of an operation Id separated by an underscore i.e., `Noun` in a `Noun_Verb` should not conflict with names of the models defined in the definitions section. If this happens, AutoRest appends `Model` to the name of the model to resolve the conflict (`NounModel` in given example) with the name of the client itself (which will be named as `Noun` in given example). This can result in an inconsistent user experience.

## Why the rule is important

To ensure all models are named consistently and exactly as defined in the spec.

## How to fix the violation

Ensure operation Ids are named in such a way that the `Noun` in `Noun_Verb` is of the plural form and does not conflict with the names of any models in the definitions section of the spec.
