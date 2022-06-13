# OperationDescriptionOrSummaryRequired

## Category

SDK Warning

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

{0} lacks 'description' and 'summary' property. Consider adding a 'description'/'summary' element. Accurate description/summary is essential for maintaining reference documentation.

## Description

Every operation must have a 'description'/'summary' property.

## Why the rule is important

Appropriate documentation could not be generated without the 'description'/'summary' property.

## How to fix the violation

For each operation, provide at least one of the property - description/summary.
