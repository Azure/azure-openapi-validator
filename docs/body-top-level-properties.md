# BodyTopLevelProperties

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

Top level properties should be one of name, type, id, location, properties, tags, plan, sku, etag, managedBy, identity, systemData, extendedlocation. Model definition '{0}' has extra properties ['{1}'].

## Description

Per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md), top level properties of a resource should be only ones from the allowed set.

## CreatedAt

N/A

## LastModifiedAt

February 18, 2020

## Why the rule is important

[ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md).

## How to fix the violation

Consider moving extra properties into "properties" bag of the resource model.

## Examples

## Bad example

"extraProperty" is not allowed at top level of the resource model.

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

## Good example

Notice that "extraProperty" is inside "properties" bag, and not at top level.

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
