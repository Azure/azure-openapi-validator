# Contributing

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## packages

[openapi-validator-core]: packages/azure-openapi-validator/core
[openapi-validator-rulesets]: packages/rulesets
[openapi-validator-autorest-plugin]: packages/packages/azure-openapi-validator/autorest

## Build dependencies

- Node (12.x or higher)
- Node Package Manager
- Typescript (3.7.0 or higher)
- @Microsoft/Rush()

## Build scripts

### How to build

The first step would be to run ```rush update``` so we have all the required modules installed.
#### How to build the whole repo

``` bash
rush build
```

### How to test
To run all tests under the repo
```
rush test
```

### How to write a new validation rule using typescript
#### spectral rule

#### native rule

### How to run regression test

1. Init sub module.
```
git update submodule --init
```
2. npm run 
```
cd regression
npm run regression-test
```

### How to run locally

1. use default lint version:
```
autorest --v3 --spectral --azure-validator --input-file=<path-to-spec>
or 
autorest --v3 --spectral --azure-validator <path-to-readme> [--tag=<readme tag>]
```
2. use specified lint version:
```
autorest --v3 --spectral --azure-validator --input-file=<path-to-spec> --use=@microsoft.azure/classic-openapi-validator@1.1.4 --use=@microsoft.azure/openapi-validator@1.4.0
autorest --v3 --spectral --azure-validator  --use=@microsoft.azure/openapi-validator@1.4.0 [--tag=<readme tag>] <path-to-readme>
```
3. use latest lint version:
```
autorest --v3 --spectral --azure-validator --input-file=<path-to-spec>  --use=@microsoft.azure/openapi-validator@latest
autorest --v3 --spectral --azure-validator  --use=@microsoft.azure/openapi-validator@latest [--tag=<readme tag>] <path-to-readme>
```

### How to publish

