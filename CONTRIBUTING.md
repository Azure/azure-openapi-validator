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
and follow below steps to add a rule for azure rest api specs.

- add a custom function in 'packages\rulesets\spectral\functions'
- add a rule config to the proper ruleset configuaration , current we have 3 ruleset configurations:
  1. az-common.ts : for rule that apply to all azure spec.
  1. az-arm.ts: for rules that only apply to ARM spec.
  1. az-dataplane.ts: for rules that only apply to dataplane spec.

- add a test case, usually one custom function should have one test, the corresponding testing files is in 'packages\rulesets\spectral\test'

### native rule
Since the spectral rule can only process one swagger in its rule fucntion, the native ruleset is for complicated rules which need to visit multiple swaggers. For example, if you want to have a rule to ensure two swaggers that does not have duplicated model.

Differetiating with spectral rule,  there is a swagger inventory (see below defintions) will be peresent in the rule context to visit other swaggers different with current one.

``` ts
export interface ISwaggerInventory {
  referencesOf(specPath: string): string[],
  getSingleDocument(specPath: string):any
  getAllDocuments(): Map<string,any>
}
```

a sample rule config is like :

``` ts
  rules: {
    my-ruleName: {
      category: "SDKViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
      resolved: true,
      given: "$.definitions.*",
      then: {
        fieldMatch: "$..properties.*~",
        options: {
          match: "^[0-9]+$"
        },
        execute: pattern
      }
    }
```

Follow below steps to add a native rule:
1. add a custom function (optional) in 'packages\rulesets\native\functions'

2. add a rule  to the ruleset configuration
   the ruleset configuration is in 'packages\rulesets\native\rulesets' folder, each `.ts` is a ruleset. there are  2 kinds:
   1. arm: for arm spec
   1. common: for all spec

3. add a test for the custom function

### rule properties

- category: "ARMViolation" | "OneAPIViolation" | "SDKViolation" | "RPaaSViolation"
- OpenapiType:  indicate which kinds of azure spec it applies to.
- severity:  "error" | "warning" | "info"
- resolved:  whether or not resolve the "ref" in the swagger.
- given:  the jsonpath to match for the current swagger.
- then: the action to invoke for the matched 'given'.
  1. fieldMatch: the jsonpath to match the given json object.
  1. options:  the options to pass to the rule function.

## How to run regression test

1. Init sub module.
```
git update submodule --init
```
2. run test
```
rush regression-test
```

## How to run locally

Run the linter via autorest:

1. use local lint version:
```
autorest --v3 --spectral --azure-validator --input-file=<path-to-spec>  --use=packages/azure-openapi-valdiator/autorest
autorest --v3 --spectral --azure-validator  --use=--use=packages/azure-openapi-valdiator/autorest
```
2. use latest published lint version:
```
autorest --v3 --spectral --azure-validator --input-file=<path-to-spec>  --use=@microsoft.azure/openapi-validator@latest
autorest --v3 --spectral --azure-validator  --use=@microsoft.azure/openapi-validator@latest [--tag=<readme tag>] <path-to-readme>
```

