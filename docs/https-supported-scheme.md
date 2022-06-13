# HttpsSupportedScheme

## Category

SDK Warning

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

Azure Resource Management only supports HTTPS scheme.

## Description

Verifies whether specification supports HTTPS scheme or not.

## Why the rule is important

All the ARM specification should support HTTPS endpoint.

## How to fix the violation

Please add `schemes` to the specification as shown in example below.

## Impact on generated code

N/A.

## Examples

```json
"schemes": [
  "https"
]
```
