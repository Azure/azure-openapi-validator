# Prerequisites

- Node (12.x or higher)
- Node Package Manager
- Typescript (3.7.0 or higher)
- @Microsoft/Rush (5.x or hider)

# Installing NPM dependencies

```bash
rush update
```

This will install all of the npm dependencies of all projects in the
repo. Do this whenever you `git pull` or your workspace is freshly
cleaned/cloned.

Note that `rush update` must be done before building in VS Code or
using the command line.

# Build scripts

## How to build

The first step would be to run ```rush update``` so we have all the required modules installed.

### How to build the whole repo

``` bash
rush build
```

## How to test

To run all tests under the repo
```bash
rush test
```

## How to write a new validation rule using typescript

### spectral rule
please refer to https://meta.stoplight.io/docs/spectral/ZG9jOjI1MTg5-custom-rulesets firstly.
and follow below steps to add a rule for azure.

- add a custom function in 'packages\rulesets\spectral\functions'
- add a rule config to the proper ruleset configuaration , current we have 3 ruleset configurations:
  1. az-common.ts : for rule that apply to all azure spec.
  1. az-arm.ts: for rules that only apply to ARM spec.
  1. az-dataplane.ts: for rules that only apply to dataplane spec.

- add a test for it, usually one custom function should have one test, the testing files is in 'packages\rulesets\spectral\test'

### native rule
the native ruleset is for complicated rules which need to visit multiple swaggers.
The difference towards spectral rule is that a swagger inventory will be peresent in the rule context to visit other swaggers different with current one.

a sample rule config is like :
```
  rules: {
    my-ruleName: {
      category: "SDKViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
      resolved: true,
      given: "$.definitions.*",
      then: {
        fieldSelector: "$..properties.*~",
        options: {
          match: "^[0-9]+$"
        },
        execute: pattern
      }
    },
```

Follow below steps to add a native rule:
1. add a custom function (optional) in 'packages\rulesets\native\functions'

2. add a rule  to the ruleset configuration
   the ruleset configuration is in 'packages\rulesets\native\rulesets' folder, each `.ts` is a kind of ruleset. Just like there are still 2 kinds:
   1. arm
   1. dataplane
   1. default
    
3. add a test for the custom function (optional)


## How to run regression test

1. Init sub module.
```
git update submodule --init
```
2. npm run 
```
cd regression
npm run regression-test
```

## How to run locally

1. use local lint version:
```
autorest --v3 --spectral --azure-validator --input-file=<path-to-spec>  --use=packages/azure-openapi-valdiator/autorest
autorest --v3 --spectral --azure-validator  --use=--use=packages/azure-openapi-valdiator/autorest
```
2. use latest lint version:
```
autorest --v3 --spectral --azure-validator --input-file=<path-to-spec>  --use=@microsoft.azure/openapi-validator@latest
autorest --v3 --spectral --azure-validator  --use=@microsoft.azure/openapi-validator@latest [--tag=<readme tag>] <path-to-readme>
```

## How to publish