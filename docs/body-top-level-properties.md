# BodyTopLevelProperties

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Put-V1-06

## Description

Top level properties should be one of `name`, `type`, `id`, `location`, `properties`, `tags`, `plan`, `sku`, `etag`,
`managedBy`, `managedByExtended`, `identity`, `systemData`, `extendedlocation`. Per [ARM guidelines](https://github.com/cloud-and-ai-microsoft/resource-provider-contract/blob/master/v1.0/resource-api-reference.md),
top level properties of a resource should be only ones from the allowed set.

## How to fix

Either remove the extra properties or move them into the `properties` bag of the resource model.

## Good example

Notice that `extraProperty` is inside `properties` bag, and not at top level.

```json5
"VersionedApplicationType": {
  "description": "The versioned application type resource",
  "properties": {
    "properties":{
      "extraProperty": {
        "type": "string",
        "description": "Extra property description"
      }
    }
  },
  "allOf": [
  {
    "$ref": "#/definitions/Resource"
  }
  ]
}
```

## Bad example

`extraProperty` is not allowed at top level of the resource model.

```json5
"VersionedApplicationType": {
  "description": "The versioned application type resource",
  "properties": {
    "extraProperty": {
      "type": "string",
      "description": "Extra property description"
    }
  },
  "allOf": [
  {
    "$ref": "#/definitions/Resource"
  }
  ]
}
```
