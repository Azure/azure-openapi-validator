# XmsPathsMustOverloadPaths

## Category

SDK Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

Paths in x-ms-paths must overload a normal path in the paths section, i.e. a path in the x-ms-paths must either be same as a path in the paths section or a path in the paths sections followed by additional parameters.

## Description

The `x-ms-paths` extension allows us to overload an existing path based on path parameters. We cannot specify an `x-ms-paths` without a path that already exists in the `paths` section. For more details about this extension please refer [here](https://github.com/Azure/azure-rest-api-specs/blob/dce4da0d748565efd2ab97a43d0683c2979a974a/documentation/swagger-extensions.md#x-ms-paths).

## Why the rule is important

The `x-ms-paths` overload an existing path only, not adhering to this rule would violate the applicability of the extension itself.

## How to fix the violation

Ensure that the `x-ms-paths` is overloading an existing url path in the `paths` section.

## Good Example

```json
  "paths":{
    "/foo":{
      ...
    }
  },
  "x-ms-paths":{
    "/foo?op=baz":{
      ...
    }
  }
```

## Bad Example

```json
  "paths":{
    "/foo":{
      ...
    }
  },
  "x-ms-paths":{
    "/bar?op=baz":{
      ...
    }
  }
```
