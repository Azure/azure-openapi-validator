# Contributing

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact
[opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

# Prerequisites to build locally

1. Install [nvm] ([nvm for Windows]), a tool to manage `Node.js` versions.
2. Restart your terminal so that `nvm` command is recognized.
3. Using `nvm`, install `Node.js` version `12.22.12`. This is the version used by the [PR CI pipeline] to build `LintDiff`.
   - `nvm install 12.22.12`
   - `nvm use 12.22.12`
   - `node --version`, to confirm.
4. Note that installing `Node.js` will also install `npm`.
5. Install [@Microsoft/Rush](https://rushjs.io/). Note that the [PR CI pipeline] uses version `5.62.1`, so you might want to switch to it in case you run into unexpected issues later on.
   ```bash
   # Install latest rush, globally
   npm install -g @microsoft/rush

   # OR Install specific version, to the local node_modules folder
   cd "this_repo_local_clone_dir"
   npm install @microsoft/rush@5.26.1
   ```

[nvm]: https://github.com/nvm-sh/nvm#installing-and-updating
[nvm for Windows]: https://github.com/coreybutler/nvm-windows
[PR CI pipeline]: https://dev.azure.com/azure-sdk/public/_build?definitionId=5261&_a=summary

# How to prepare for a PR submission after you made changes locally

We will be replicating locally what [PR CI pipeline] is doing, and more.

1. Ensure you have fulfilled `Prerequisites to build locally`.
1. Ensure your local clone branch is up-to-date with `main`. If you are using a fork, ensure your local fork branch is based on origin repo `main`.
1. Run `rush update` to ensure all the required modules are installed.
1. Run `rush build` to regenerate relevant files that need to be checked-in.
1. Run `rush lint`. It must pass. If it doesn't, you can debug with `rush lint --verbose`.
1. Run `rush test` to run the unit tests. They should all pass.
1. If you changed the ruleset, run `rush regen-ruleindex` to update contents of `docs/rules.md`.
   For details, see `How to refresh the index of rules documentation`.
1. Run `rush change` to generate changelog. You will need to follow the interactive prompts.
   You can edit the added files later. If you don't add the right entries, the CI build will fail.
1. If the change is significant, you might consider manually adding appropriate entry to `changelog.md`.
1. You are now ready to submit your PR.

# Installing NPM dependencies

```bash
rush update
```

This will install all of the npm dependencies of all projects in the
repo. Do this whenever you `git pull` or your workspace is freshly
cleaned/cloned.

Note that `rush update` must be done before building in VS Code or
using the command line.

# How to test

To run all tests under the repo

```bash
rush test
```

# How to write a new validation rule using typescript

## Spectral rule

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

```md
# RuleName

## Description

<add the description for the rule.>
## How to fix
<describe how to fix the violations.>
```

## Native rule

Since the spectral rule can only process one swagger in its rule function, the native ruleset is for complicated rules which need to visit multiple swaggers. For example, if you want to have a rule to ensure two swaggers that does not have duplicated model.

Differentiating with spectral rule, there is a swagger inventory (see below definitions) will be present in the rule context to visit other swaggers different with current one.

```ts
export interface ISwaggerInventory {
  /* Get all specs that reference to the given specPath
   *
   * @param specPath the file path of the swagger.
   * @returns a record contains all the specs that reference to the given spec path, key indicates spec path, value indicates the json object of the spec.
   */
  referencesOf(specPath: string): Record<string, any>
  /*
   * param  specPath specPath the file path of the swagger.
   * returns the json object of given spec if given the 'specPath' or a Record<string,any> contains all the specs paths and objects if specPath is omitted.
   */
  getDocuments(specPath?: string): Record<string, any> | any
}
```

a sample rule config is like :

```ts
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

2. add a rule to the ruleset configuration
   the ruleset configuration is in 'packages\rulesets\native\rulesets' folder, each `.ts` is a ruleset. there are 2 kinds:

   1. arm: for arm spec
   1. common: for all spec

3. add a test for the custom function

## Rule properties

- category: "ARMViolation" | "OneAPIViolation" | "SDKViolation" | "RPaaSViolation"
- OpenapiType: indicate which kinds of azure spec it applies to.
- severity: "error" | "warning" | "info"
- given: the jsonpath to match for the current swagger.
- then: the action to invoke for the matched 'given'.
  1. fieldMatch: the jsonpath to match the given json object.
  1. options: the options to pass to the rule function.

# How to run regression test

1. Init sub module.

   ```bash
   git update submodule --init
   ```

2. run test

   ```bash
   rush regression-test
   ```

# How to refresh the index of rules documentation

the [doc index](./docs/rules.md) is an index for searching any rule documentation provided in this repo.
you can run below command to regenerate it after you added or updated some rules in the 'docs'.

```bash
rush regen-ruleindex
```

# How to run LintDiff locally

Instructions in this section use an example that assumes you are trying to locally reproduce a LintDiff failure
in one of the PRs submitted to [azure-rest-api-specs](https://github.com/Azure/azure-rest-api-specs) or [azure-rest-api-specs-pr](https://github.com/Azure/azure-rest-api-specs-pr) repos.

## Setup

1. Ensure you meet the `Prerequisites to build locally` **up to and including** `rush build`.
2. [Install AutoRest using npm](https://github.com/Azure/autorest/blob/main/docs/install/readme.md):
   ```bash
   # Depending on your configuration you may need to be elevated or root to run this. (on OSX/Linux use 'sudo' )
   npm install -g autorest
   # run using command 'autorest' to check if installation worked
   autorest --help
   ```
3. Clone the repo that has the specification on which you are trying to run LintDiff, and check out appropriate branch.
   - As an example, let's say you are trying to reproduce LintDiff run for [azure-rest-api-specs-pr PR 12357](https://github.com/Azure/azure-rest-api-specs-pr/pull/12357). Do the following:
   - `cd repos` // Here we assume your local clones are in `repos` dir.
   - `git clone https://github.com/Azure/azure-rest-api-specs-pr.git`
   - `git checkout containerservice/official/fleet-api-release`
4. `cd repos/azure-openapi-validator` // Here we assume this is your local clone of LintDiff.
5. Ensure your local LintDiff is prepped for execution. See `How to prepare for a PR submission after you made changes locally`.

## Execute your local LintDiff code

6. Execute following command:

   ```bash
   autorest --v3 --spectral --azure-validator --use=./packages/azure-openapi-validator/autorest --tag=<api-version> <path-to-autorest-config-file>
   ```

   For example, if you are trying to reproduce [azure-rest-api-specs-pr PR 12357 Staging LintDiff failure], but using local LintDiff code, you would use:

   ```bash
   autorest --v3 --spectral --azure-validator --use=./packages/azure-openapi-validator/autorest --tag=package-2022-09-preview ../azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/readme.md
   ```

   Note that there maybe over 1 minute long breaks before anything is output to the console.

   Note that the [readme.md](https://github.com/Azure/azure-rest-api-specs-pr/blob/53353cc286fc2d89b21927c80f3f3078e8af989f/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/readme.md) we pass here is indeed an AutoRest config file and it has [package-2022-09-preview](https://github.com/Azure/azure-rest-api-specs-pr/blob/53353cc286fc2d89b21927c80f3f3078e8af989f/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/readme.md#tag-package-2022-09-preview) section that points to input file of `preview/2022-09-02-preview/fleets.json`.

7. Troubleshooting: if in step 6. you get `error   |   Error: Can only create file URIs from absolute paths. Got 'packages\azure-openapi-validator\autorest\readme.md'` then ensure you passed `--use=./packages/azure-openapi-validator/autorest` and not `--use=packages/azure-openapi-validator/autorest`.

## Execute locally LintDiff version published to npm

6. Familiarize yourself with instructions for `Execute your local LintDiff code`. The only difference is that instead of passing `--use=./packages/azure-openapi-validator/autorest` you will pass `-use=@microsoft.azure/openapi-validator@<version-tag>` where you can obtain `<version-tag>` from [npm package @microsoft.azure/openapi-validator](https://www.npmjs.com/package/@microsoft.azure/openapi-validator?activeTab=versions).

   Continuing our example for PR 12357, we can observe that version `2.0.1`, which as of this writing (5/5/2023) runs in production, produces only `warning | IgnoredPropertyNextToRef`:

   ```bash
   autorest --v3 --spectral --azure-validator --use=@microsoft.azure/openapi-validator@2.0.1 --tag=package-2022-09-preview ../azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/readme.md
   ```

   On the other hand, version `2.2.0-beta.3` which as of this writing corresponds to `beta`, does produce significantly more warnings, which match the failures observed in the [Staging LintDiff CI check][azure-rest-api-specs-pr PR 12357 Staging LintDiff failure]:

   ```bash
   autorest --v3 --spectral --azure-validator --use=@microsoft.azure/openapi-validator@2.2.0-beta.3 --tag=package-2022-09-preview ../azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/readme.md
   ```

   You can find example outputs of these commands in the `Appendix` section at the end of this document.

# How to use the Spectral ruleset

## Dependencies

The Spectral ruleset requires Node version 14 or later.

## Install Spectral

`npm i @stoplight/spectral-cli -g`

## Usage

Azure-openapi-validator currently defines three Spectral ruleset configurations:

1. az-common.ts : for rules that apply to all Azure REST APIs
1. az-arm.ts: for rules that only apply to ARM REST APIs
1. az-dataplane.ts: for rules that only apply to dataplane REST APIs

All rulesets reside in the `packages/rulesets/generated/spectral` folder of the repo.

You can specify the ruleset directly on the command line:

`spectral lint -r https://raw.githubusercontent.com/Azure/azure-openapi-validator/develop/packages/rulesets/generated/spectral/az-dataplane.js <api definition file>`

Or you can create a Spectral configuration file (`.spectral.yaml`) that references the ruleset:

```yaml
extends:
  - https://raw.githubusercontent.com/Azure/azure-openapi-validator/develop/packages/rulesets/generated/spectral/az-dataplane.js
```

## Example

```bash
spectral lint -r https://raw.githubusercontent.com/Azure/azure-openapi-validator/develop/packages/rulesets/generated/spectral/az-dataplane.js petstore.yaml
```

## Using the Spectral VSCode extension

There is a [Spectral VSCode extension](https://marketplace.visualstudio.com/items?itemName=stoplight.spectral) that will run the Spectral linter on an open API definition file and show errors right within VSCode. You can use this ruleset with the Spectral VSCode extension.

1. Install the Spectral VSCode extension from the extensions tab in VSCode.
2. Create a Spectral configuration file (`.spectral.yaml`) in the root directory of your project as shown above.
3. Set `spectral.rulesetFile` to the name of this configuration file in your VSCode settings.

Now when you open an API definition in this project, it should highlight lines with errors.
You can also get a full list of problems in the file by opening the "Problems panel" with "View / Problems".
In the Problems panel you can filter to show or hide errors, warnings, or infos.

# Appendix

## Appendix for `Execute locally LintDiff version to npm`

This command:

```bash
repos\azure-openapi-validator> autorest --v3 --spectral --azure-validator --use=@microsoft.azure/openapi-validator@2.0.1 --tag=package-2022-09-preview ../azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/readme.md
```

Results in:

```bash
AutoRest code generation utility [cli version: 3.6.3; node: v19.1.0]
(C) 2018 Microsoft Corporation.
https://aka.ms/autorest
info    | AutoRest core version selected from configuration: ^3.2.0.
info    |    Loading AutoRest core      '<home_dir>\.autorest\@autorestcore@3.9.5\nodemodules\@autorest\core\dist' (3.9.5)
info    |    Installing AutoRest extension '@microsoft.azure/openapi-validator' (2.0.1 -> 2.0.1)
installing... [========================================] 100% | 547/547
info    |    Installed AutoRest extension '@microsoft.azure/openapi-validator' (2.0.1->2.0.1)
warning | IgnoredPropertyNextToRef | Semantic violation: Sibling values alongside $ref will be ignored. See https://github.com/Azure/autorest/blob/main/docs/openapi/howto/$ref-siblings.md for allowed values (components > schemas > Resource > properties > systemData)
  keys: [ 'type' ]
info    | Autorest completed in 89.91s. 0 files generated.
```

This command:

```bash
repos\azure-openapi-validator>autorest --v3 --spectral --azure-validator --use=@microsoft.azure/openapi-validator@2.2.0-beta.3 --tag=package-2022-09-preview ../azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/readme.md
```

results in:

```bash
AutoRest code generation utility [cli version: 3.6.3; node: v19.1.0]
(C) 2018 Microsoft Corporation.
https://aka.ms/autorest
info    | AutoRest core version selected from configuration: ^3.2.0.
info    |    Loading AutoRest core      '<home_dir>\.autorest\@autorestcore@3.9.5\nodemodules\@autorest\core\dist' (3.9.5)
info    |    Installing AutoRest extension '@microsoft.azure/openapi-validator' (2.2.0-beta.3 -> 2.2.0-beta.3)
installing... [========================================] 100% | 547/547
info    |    Installed AutoRest extension '@microsoft.azure/openapi-validator' (2.2.0-beta.3->2.2.0-beta.3)
warning | IgnoredPropertyNextToRef | Semantic violation: Sibling values alongside $ref will be ignored. See https://github.com/Azure/autorest/blob/main/docs/openapi/howto/$ref-siblings.md for allowed values (components > schemas > Resource > properties > systemData)
  keys: [ 'type' ]
error   | ProvisioningStateMustBeReadOnly | provisioningState property must be set to readOnly.
    - file:///<home_dir>/repos/azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/preview/2022-09-02-preview/fleets.json:201:13
error   | PutResponseSchemaDescription | Description of 200 response code of a PUT operation MUST include term "update".
    - file:///<home_dir>/repos/azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/preview/2022-09-02-preview/fleets.json:270:9
error   | ProvisioningStateMustBeReadOnly | provisioningState property must be set to readOnly.
    - file:///<home_dir>/repos/azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/preview/2022-09-02-preview/fleets.json:273:13
error   | ProvisioningStateMustBeReadOnly | provisioningState property must be set to readOnly.
    - file:///<home_dir>/repos/azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/preview/2022-09-02-preview/fleets.json:286:13
error   | ProvisioningStateMustBeReadOnly | provisioningState property must be set to readOnly.
    - file:///<home_dir>/repos/azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/preview/2022-09-02-preview/fleets.json:354:13
warning | ProvisioningStateSpecifiedForLRODelete | 200 response schema in long running DELETE operation is missing ProvisioningState property. A LRO DELETE operations 200 response schema must have ProvisioningState specified.
    - file:///<home_dir>/repos/azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/preview/2022-09-02-preview/fleets.json:407:11
error   | ProvisioningStateMustBeReadOnly | provisioningState property must be set to readOnly.
    - file:///<home_dir>/repos/azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/preview/2022-09-02-preview/fleets.json:587:13
error   | PutResponseSchemaDescription | Description of 200 response code of a PUT operation MUST include term "update".
    - file:///<home_dir>/repos/azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/preview/2022-09-02-preview/fleets.json:666:9
error   | ProvisioningStateMustBeReadOnly | provisioningState property must be set to readOnly.
    - file:///<home_dir>/repos/azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/preview/2022-09-02-preview/fleets.json:669:13
error   | ProvisioningStateMustBeReadOnly | provisioningState property must be set to readOnly.
    - file:///<home_dir>/repos/azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/preview/2022-09-02-preview/fleets.json:682:13
warning | ProvisioningStateSpecifiedForLRODelete | 200 response schema in long running DELETE operation is missing ProvisioningState property. A LRO DELETE operations 200 response schema must have ProvisioningState specified.
    - file:///<home_dir>/repos/azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/preview/2022-09-02-preview/fleets.json:749:11
error   | ResourceMustReferenceCommonTypes | Resource definition 'OperationListResult' must reference the common types resource definition for ProxyResource or TrackedResource.
    - file:///<home_dir>/repos/azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/preview/2022-09-02-preview/fleets.json:788:3
error   | ResourceMustReferenceCommonTypes | Resource definition 'Fleet' must reference the common types resource definition for ProxyResource or TrackedResource.
    - file:///<home_dir>/repos/azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/preview/2022-09-02-preview/fleets.json:801:5
error   | ResourceMustReferenceCommonTypes | Resource definition 'FleetListResult' must reference the common types resource definition for ProxyResource or TrackedResource.
    - file:///<home_dir>/repos/azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/preview/2022-09-02-preview/fleets.json:888:5
error   | ResourceMustReferenceCommonTypes | Resource definition 'FleetMember' must reference the common types resource definition for ProxyResource or TrackedResource.
    - file:///<home_dir>/repos/azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/preview/2022-09-02-preview/fleets.json:911:5
error   | ResourceMustReferenceCommonTypes | Resource definition 'FleetMemberListResult' must reference the common types resource definition for ProxyResource or TrackedResource.
    - file:///<home_dir>/repos/azure-rest-api-specs-pr/specification/containerservice/resource-manager/Microsoft.ContainerService/fleet/preview/2022-09-02-preview/fleets.json:936:5
info    | Autorest completed in 135.35s. 0 files generated.
```

[azure-rest-api-specs-pr PR 12357 Staging LintDiff failure]: https://dev.azure.com/azure-sdk/internal/_build/results?buildId=2753856&view=logs&j=688669d0-441c-57c3-cf6d-f89a22ccfa5d&t=b91b1e88-b042-5e18-36d8-34e4fb3a9b3b&l=81
