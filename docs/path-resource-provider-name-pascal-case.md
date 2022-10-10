# PathResourceProviderNamePascalCase

## Category

ARM Error

## Applies to

ARM and Data Plane OpenAPI(swagger) specs

## Output Message

Resource provider naming must follow the pascal case. Path: {your path}

## Description

Resource provider naming in path SHOULD follow the pascal case. (e.g. Microsoft.Insights/components/proactiveDetectionConfigs)

For more detail, pls refer to https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#172-casing

## CreatedAt

February 18, 2020

## LastModifiedAt

February 18, 2020

## How to fix the violation

Rename resource provider as pascal case in path.

Eg: In this case, you need to replace `Microsoft.computer` with `Microsoft.Computer` to follow pascal case.

Invalid:

```
paths : { "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.computer/{name}" : {
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
