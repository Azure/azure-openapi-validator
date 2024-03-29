# AnonymousBodyParameter

## Category

SDK Error

## Applies to

ARM specs

## Output Message

Inline/anonymous models must not be used, instead define a schema with a model name in the "definitions" section and refer to it. This allows operations to share the models.

## Description

This rule appears if in the parameter definition you have anonymous types.

## Why the rule is important

Anonymous parameters will be autogenerated as non-descriptive parameters which the client will not be able to share across operations or provide good documentation for, thereby resulting in poor user experience.

## How to fix the violation

Move the schema to the definitions section and reference it using $ref.
