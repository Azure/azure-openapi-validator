# LocationMustHaveXmsMutability

## Category

SDK Warning

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Put-V1-14

## Description

A tracked resource's `location` property must have the `x-ms-mutability` properties set as `read`, `create` ('\"x-ms-mutability\":[\"read\", \"create\"]'). Location is a property that is set once and non-updatable for a tracked resource. Hence, per ARM guidelines the only operations allowed are `read` and `create`.

## How to fix

Ensure that the `location` property in the tracked resource's hierarchy has `x-ms-mutability` correctly set to `read` and `create`.

## Bad examples

```json
"location": {
  "type": "string",
  "description": "location of the resource",
}

"location": {
  "type": "string",
  "description": "location of the resource",
  "x-ms-mutability": [ "create" ]
}

"location": {
  "type": "string",
  "description": "location of the resource",
  "x-ms-mutability": [ "read" ]
}

```

## Good examples

```json
"location": {
  "type": "string",
  "description": "location of the resource",
  "x-ms-mutability": [ "create", "read" ]
}
```
