# ControlCharactersNotAllowed

## Category

SDK Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

May not contain control characters:  Characters:'{0}' in:'{1}'

## Description

Verifies whether if a specification does not have any control characters in it.
Control characters are not allowed in a specification.

## Why the rule is important

Per ARM guidelines, a specification must not contain any control characters.

## How to fix the violation

Remove the control characters in the specification.

## Examples

A list of control characters in unicode can be found [here](https://unicode-table.com/en/).
