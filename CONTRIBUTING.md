# Contributing

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Prerequisites

- [Node.js](https://nodejs.org/) (14.x or higher)
- [@Microsoft/Rush](https://rushjs.io/) (5.x or hider)

```bash
npm install -g @microsoft/rush
```

## Installing NPM dependencies

```bash
rush update
```

This will install all of the npm dependencies of all projects in the
repo. Do this whenever you `git pull` or your workspace is freshly
cleaned/cloned.

Note that `rush update` must be done before building in VS Code or
using the command line.

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

### Spectral rule

Please refer to https://meta.stoplight.io/docs/spectral/ZG9jOjI1MTg5-custom-rulesets firstly.
and follow below steps to add a rule for azure rest api specs.

- add a rule config to the proper ruleset configuaration in packages\rulesets\src\spectral.
  Currently we have 3 ruleset configurations:
  1. az-common.ts : for rule that apply to all Azure spec.
  1. az-arm.ts: for rules that only apply to ARM spec.
  1. az-dataplane.ts: for rules that only apply to dataplane spec.
- if needed, add a custom function in 'packages\rulesets\src\spectral\functions'

- add a test case, usually every rule should have one test, the corresponding testing files is in 'packages\rulesets\src\spectral\test'

- add a doc for the rule in 'docs', the rule doc file name is following kebab-case, contains following content:

``` md
# RuleName

## Description
<add the description for the rule.>
## How to fix
<describe how to fix the violations.>
```

### Native rule

Since the spectral rule can only process one swagger in its rule function, the native ruleset is for complicated rules which need to visit multiple swaggers. For example, if you want to have a rule to ensure two swaggers that does not have duplicated model.

Differentiating with spectral rule, there is a swagger inventory (see below definitions) will be present in the rule context to visit other swaggers different with current one.

``` ts
export interface ISwaggerInventory {
  /* Get all specs that reference to the given specPath
   * 
   * @param specPath the file path of the swagger.
   * @returns a record contains all the specs that reference to the given spec path, key indicates spec path, value indicates the json object of the spec.
   */
  referencesOf(specPath: string): Record<string,any>,
  /*
   * param  specPath specPath the file path of the swagger.
   * returns the json object of given spec if given the 'specPath' or a Record<string,any> contains all the specs paths and objects if specPath is omitted.
  */
  getDocuments(specPath?: string): Record<string,any> | any
}
```

a sample rule config is like :

``` ts
  rules: {
    my-ruleName: {
      category: "SDKViolation",
      openapiType: OpenApiTypes.arm,
      severity: "error",
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

### Rule properties

- category: "ARMViolation" | "OneAPIViolation" | "SDKViolation" | "RPaaSViolation"
- OpenapiType:  indicate which kinds of azure spec it applies to.
- severity:  "error" | "warning" | "info"
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

## How refresh the index of rules documentation

the [doc index](./docs/rules.md) is an index for searching any rule documentation provided in this repo.
you can run below command to regen it after you added or updated some rules in the 'docs'.
```bash
rush regen-ruleindex
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
