# SummaryAndDescriptionMustNotBeSame

## Category

SDK Warning

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

The summary and description values should not be same.

## Description

Each operation has a summary and description values. They must not be same.

## Why the rule is important

The summary must provide a short summary of the operation. The description must provide a detailed description of the operation. This will ensure that all the operations are well documented.

## How to fix the violation

Provide a short summary for the summary section and a detailed description for the description section.

## Good Examples

The following operation is a good example:
```json
......
......
"put": {
  "summary": "Creates or Updates an availability set",
  "description": "This operation creates or updates an availability set. This takes the resourceGroupName and availabilitySetName as input. If an availability set with the same name exists, then the same is updated. Else a new availability set is created.",
  .....
  .....
}
......
......
```

## Bad Examples

The following would be invalid:
```json
......
......
"put": {
  "summary": "Creates or Updates an availability set",
  "description": "Creates or Updates an availability set",
  .....
  .....
}
......
......
```
