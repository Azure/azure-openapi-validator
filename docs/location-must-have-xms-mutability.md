# LocationMustHaveXmsMutability

## Category

SDK Warning

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-V2-PUT-14

## Output Message

Property 'location' must have '\"x-ms-mutability\":[\"read\", \"create\"]' extension defined. Resource Model: '{0}'

## Description

A tracked resource's `location` property must have the `x-ms-mutability` properties set as `read`, `create`.

## Why the rule is important

Location is a property that is set once and non-updatable for a tracked resource. Hence, per ARM guidelines the only operations allowed are `read` and `create`.

## How to fix the violation

Ensure that the `location` property in the tracked resource's hierarchy has `x-ms-mutability` correctly set to `read` and `create`.
For example:

```json
"location": {
  "type": "string",
  "description": "location of the resource",
  "x-ms-mutability": [ "create", "read" ]
}
```
