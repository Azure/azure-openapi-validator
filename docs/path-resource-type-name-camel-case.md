# PathResourceTypeNameCamelCase

## Category

ARM Error

## Applies to

ARM and Data Plane OpenAPI(swagger) specs

## Output Message

Resource type naming SHOULD follow camel case. Path: {your path}

## Description

Resource type or other identifiers (include: namespace, entityTypes) SHOULD follow camel case. (e.g. Microsoft.Insights/components/proactiveDetectionConfigs, not ProactiveDetectionConfig)

For more detail, pls refer to https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#172-casing

## CreatedAt

February 18, 2020

## LastModifiedAt

February 18, 2020

## How to fix the violation

Rename resource type or other identifiers as camel case in path.

Eg: In this case, you need to replace `ResourceGroups` with `resourceGroups` to follow camel case.

Invalid:

```
paths : { "/subscriptions/{subscriptionId}/ResourceGroups/{resourceGroupName}/providers/Microsoft.Computer/{name}" : {
    "get": {
       ...
    }
    "post": {
      ...
    }
  }
}
```

Valid:

```
paths : { "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Computer/{name}" : {
    "get": {
       ...
    }
    "post": {
      ...
    }
  }
}
```
