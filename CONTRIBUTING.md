# Table of Contents

- [Contributing](#contributing)
- [Prerequisites to build locally](#prerequisites-to-build-locally)
- [How to prepare for a PR submission after you made changes locally](#how-to-prepare-for-a-pr-submission-after-you-made-changes-locally)
- [How to add and roll out new linter rules](#how-to-add-and-roll-out-new-linter-rules)
- [How to deploy your changes](#how-to-deploy-your-changes)
  * [Deploy to Staging LintDiff](#deploy-to-staging-lintdiff)
  * [Deploy to Prod LintDiff](#deploy-to-prod-lintdiff)
  * [Verify the deployed changes](#verify-the-deployed-changes)
- [How to locally reproduce a LintDiff failure occurring on a PR](#how-to-locally-reproduce-a-lintdiff-failure-occurring-on-a-pr)
  * [How to install AutoRest](#how-to-install-autorest)
  * [How to obtain PR LintDiff check AutoRest command invocation details](#how-to-obtain-pr-lintdiff-check-autorest-command-invocation-details)
    + [Production LintDiff CI check](#production-lintdiff-ci-check)
    + [Staging LintDiff CI check](#staging-lintdiff-ci-check)
- [How to run LintDiff locally from source](#how-to-run-lintdiff-locally-from-sources)
- [How to set a Spectral rule to run only in staging](#how-to-set-a-spectral-rule-to-run-only-in-staging)
- [How to verify which Spectral rules are running in Production and Staging LintDiff](#how-to-verify-which-spectral-rules-are-running-in-production-and-staging-lintdiff)
- [Installing NPM dependencies](#installing-npm-dependencies)
- [How to test](#how-to-test)
- [How to write a new validation rule using typescript](#how-to-write-a-new-validation-rule-using-typescript)
  * [Spectral rule](#spectral-rule)
  * [Native rule](#native-rule)
  * [Rule properties](#rule-properties)
- [How to run regression test](#how-to-run-regression-test)
- [How to refresh the index of rules documentation](#how-to-refresh-the-index-of-rules-documentation)
- [How to use the Spectral ruleset](#how-to-use-the-spectral-ruleset)
  * [Dependencies](#dependencies)
  * [Install Spectral](#install-spectral)
  * [Usage](#usage)
  * [Example](#example)
  * [Using the Spectral VSCode extension](#using-the-spectral-vscode-extension)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>


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

A lot of the instructions below replicate what the [PR CI pipeline] is doing.

1. Ensure you have fulfilled [`Prerequisites to build locally`](#prerequisites-to-build-locally).
1. Ensure your local clone branch is based on an up-to-date `main` branch.
    - If you are using a fork, ensure your fork `main` branch is up-to-date with
    the origin `main` branch and that your branch is based on your fork `main` branch.
1. If you want for your changes to be deployed to production LintDiff, not only Staging LintDiff, follow the instructions
  given in [`How to deploy your changes`](#how-to-deploy-your-changes).
1. Run [`rush prep`](https://github.com/bdefoy/azure-openapi-validator/blob/b70f43e4ef0182daa8445ae641f7f43dac675789/common/config/rush/command-line.json#LL63C16-L63C20).
It may require some interactivity from you to update changelog. All steps must succeed.
1. If the change is significant, you might consider manually adding appropriate entry to [`changelog.md`](https://github.com/bdefoy/azure-openapi-validator/blob/main/changelog.md?plain=1).
1. You are now ready to submit your PR.
1. After your PR is merged, most likely you will want to read [`How to deploy your changes`](#how-to-deploy-your-changes)
to verify they got deployed.

The `rush prep` script is going to execute following commands. You can run them one by one instead of `rush prep` to
have more control over the process and debug any issues.

1. Run `rush update` to ensure all the required modules are installed.
1. Run `rush build` to regenerate relevant files that need to be checked-in.
    - Sometimes this will result in pending changes that will disappear once you do `git commit`.
    This presumably is caused by line ending differences that get smoothed-over by git upon commit.
1. Run `rush lint`. It must pass. If it doesn't, you can debug with `rush lint --verbose`.
    > **TIP**: this repository has [prettier configured as auto-formatter](https://github.com/Azure/azure-openapi-validator/blob/aa7c987f73d163cb5f2810a5323a61bb869bb4e5/.vscode/settings.json#LL8C17-L8C17).
    Consider taking advantage of it.
1. Run `rush test` to run the unit tests. They should all pass.
1. If you changed the ruleset, run `rush regen-ruleindex` to update contents of `docs/rules.md`.
   For details, see `How to refresh the index of rules documentation`.
1. Run `rush change` to generate changelog. You will need to follow the interactive prompts.
   Ensure to follow the [guidelines for authoring Rush changelogs](https://rushjs.io/pages/best_practices/change_logs/).
   You can edit the added files later. If you don't add the right entries, the CI build will fail.

# How to add and roll out new linter rules

This section describes the process for adding a new rule to a ruleset. The rule will first be added to
the staging pipeline, where it will not affect the ability to merge a PR. While the rule is in the
staging pipeline, the author can verify that the rule is working correctly and not incorrectly marking
violations. After verifying, the author can add the rule to the production pipeline so that the specs repo
pipeline will block specs that violate the new rule from merging into any of the main/production branches.

1. Ensure the new rule is set to run [only in staging](#how-to-set-a-spectral-rule-to-run-only-in-staging)

2. Merge the new rule to the main branch. Once merged, your new rule will start running in the staging pipeline. You can
verify the rule is running with the instructions in [Verify the deployed changes](#verify-the-deployed-changes).

3. Review Staging LintDiff pipeline build logs to see if the rules work correctly.

    1. [Get access to CloudMine](https://dev.azure.com/azure-sdk/internal/_wiki/wikis/internal.wiki/621/Telemetry)
    to see the build logs for the public and private API specs repos

    2. Use Kusto to find PRs that ran your new rule:

        ```kusto
        // edit these as desired
        let beginTime = ago(7d);
        let violationTimeBin = 10m;
        let includeStagingPipeline = true;
        let includeProdPipeline = false;
        let ruleName = "ReservedResourceNamesModelAsEnum";
        // do not edit these
        let prodPipelineName = "Azure.azure-rest-api-specs-pipeline";
        let stagingPipelineName = "Azure.azure-rest-api-specs-pipeline-staging";
        let lintDiffLogId = 62;
        let lintDiffLogMessageStart = '[{"type":"Result"';
        Build
        | where StartTime > beginTime
        | extend PipelineName = parse_json(Data).definition.name
        | where PipelineName in (iff(includeStagingPipeline, stagingPipelineName, prodPipelineName), iff(includeProdPipeline, prodPipelineName, stagingPipelineName))
        | extend SplitBranch = split(SourceBranch, "/")
        | extend PullRequestLink = strcat("https://github.com/", SplitBranch[3], "/", SplitBranch[4], "/pull/", SplitBranch[5])
        | extend BuildLink = tostring(parse_json(Data)._links.web.href)
        | project StartTime, BuildId, SourceBranch, SourceVersion, PipelineName, PullRequestLink, BuildLink
        | join kind=inner
          (
          BuildLogLine
          | where Timestamp > beginTime
          | where LogId == lintDiffLogId
          | where Message startswith_cs lintDiffLogMessageStart
          | extend LintDiffViolations = parse_json(Message)
          | mv-expand LintDiffViolations
          | extend ViolationCode = tostring(LintDiffViolations.code)
          | where ViolationCode == ruleName
          )
          on BuildId
        | summarize count() by Time=bin(Timestamp, violationTimeBin), ViolationCode, PullRequestLink, BuildLink
        | sort by count_ desc
        ```

        This will give you a list of the builds where the spec violated your rule and the count of violations for that build.
        It includes a link to the PR as well. Using this list, visit the build page, click on LintDiff to view the logs, and
        see where the rule was violated, you can then find that line in the spec by viewing the PR.

    3. Wait until your rule has run on at least 10 different PRs and you have verified there are no false positives

    4. It might also be helpful to view more than only the LintDiff results. You can use this Kusto query to see violations
    of your new rule for an API spec without taking into account the previous version of the spec:

        ```kusto
        // edit these as desired
        let beginTime = ago(7d);
        let violationTimeBin = 10m;
        let includeStagingPipeline = true;
        let includeProdPipeline = false;
        let ruleName = "ReservedResourceNamesModelAsEnum";
        // do not edit these
        let prodPipelineName = "Azure.azure-rest-api-specs-pipeline";
        let stagingPipelineName = "Azure.azure-rest-api-specs-pipeline-staging";
        let lintDiffLogId = 62;
        let lintDiffLogMessageStart = "          \"code\":";
        Build
        | where StartTime > beginTime
        | extend PipelineName = parse_json(Data).definition.name
        | where PipelineName in (iff(includeStagingPipeline, stagingPipelineName, prodPipelineName), iff(includeProdPipeline, prodPipelineName, stagingPipelineName))
        | extend SplitBranch = split(SourceBranch, "/")
        | extend PullRequestLink = strcat("https://github.com/", SplitBranch[3], "/", SplitBranch[4], "/pull/", SplitBranch[5])
        | extend BuildLink = tostring(parse_json(Data)._links.web.href)
        | project StartTime, BuildId, SourceBranch, SourceVersion, PipelineName, PullRequestLink, BuildLink
        | join kind=inner 
          (
          BuildLogLine
          | where Timestamp > beginTime
          | where LogId == lintDiffLogId
          | where Message startswith_cs lintDiffLogMessageStart
          | extend ViolationCode=trim_end('",', substring(Message, indexof(Message, ': "')+3))
          | where ViolationCode == ruleName
          )
          on BuildId
        | summarize count() by Time=bin(Timestamp, violationTimeBin), ViolationCode, PullRequestLink, BuildLink
        | sort by count_ desc 
        ```

    5. Additionally, look for any violations of your rule that come from TypeSpec-generated API specs. You can
    determine that an API spec is TypeSpec-generated if it has the following under the `info` property:

        ```json
        "x-typespec-generated": [
          {
            "emitter": "@azure-tools/typespec-autorest"
          }
        ]
        ```

3. Communicate the addition of your rule to all relevant stakeholders. This includes RP developers, the TypeSpec team, and
API reviewers. Ensure that the TypeSpec team approves of the new rule, as TypeSpec needs to be in sync with the rules. You
should work with a PM to determine the timeline for communication and addition of the new rule.

4. Once you have verified the rule works correctly and communicated its addition to stakeholders, roll it out to the
production pipeline by removing the staging-only setting from step one and creating a release with the steps in
[Deploy to Prod LintDiff](#deploy-to-prod-lintdiff).

5. If, after deploying to production, you find the rule is not behaving correctly, move it back to the staging pipeline
while you fix it by following the steps in [How to set a Spectral rule to run only in staging](#how-to-set-a-spectral-rule-to-run-only-in-staging).
Make sure to follow the step for deploying your changes to ensure the rule stops running in production. You should then validate
the rule is not running in production with as described in
[How to verify which Spectral rules are running in Production and Staging LintDiff](#how-to-verify-which-spectral-rules-are-running-in-production-and-staging-lintdiff)

# How to deploy your changes

Let's assume you followed most of the instructions given in [`How to prepare for a PR submission after you made changes locally`](#how-to-prepare-for-a-pr-submission-after-you-made-changes-locally).
You are about to submit your PR, but you want to ensure the changes in your PR will end up correctly deployed.

## Deploy to Staging LintDiff

If you want your changes to be deployed only to the [Staging pipeline](https://dev.azure.com/azure-sdk/internal/_build?definitionId=3268)
and hence Staging LintDiff, you don't need to change anything in your PR.

Once your PR is merged, do the following:

- Ensure the [Staging build] triggered. The build also triggers on schedule once a day.
  If it didn't trigger, trigger it manually.
- Once the build is complete, verify the [Staging npm release] triggered for that build.
  If it didn't trigger, trigger it manually.
- Note that sometimes the npm release may report failure even when it succeeded. This is because sometimes it tries to
  publish package twice and succeeds only on the first try.
- Verify the release worked by the `beta` versions of appropriate packages being released to npm.
  See [README `packages` section]. You can also look at the release build log.

## Deploy to Prod LintDiff

If you want your changes to be deployed to [production pipeline](https://dev.azure.com/azure-sdk/internal/_build?definitionId=1736&_a=summary)
and hence Production LintDiff, you need to do the following:

- In the PR with your changes, increase the version number of the changed packages using [`rush version --bump`](https://rushjs.io/pages/commands/rush_version/).
  - [Here](https://github.com/Azure/azure-openapi-validator/pull/506/files#diff-cad0ec93b3ac24499b20ae58530a4c3e7f369bde5ba1250dea8cad8201e75c30)
    is an example version increase for the ruleset.
  - And [here](https://github.com/Azure/azure-openapi-validator/pull/506/files#diff-359645f2d25015199598e139bc9b03c9fec5d5b1a4a0ae1f1e4f7a651675e6bf)
    for changes made to the  AutoRest extension.
  - Rush should automatically determine if the changes call for a [patch or minor](https://semver.org/#summary) version
  update and modify the relevant files. Note that if you see a change in the major version, this is likely a mistake. Do
  not increase the major version. Only patch or minor, as applicable. If your change justifies major version change,
  ensure the tool owner reviewed your PR.
  - Rush will also generate a changelog from the individual change files, deleting the individual files in the process.
  - Note: `rush version --bump` will update *all* of the changed packages. If you wish only to update one package (e.g.,
   `@microsoft.azure/openapi-validator-rulesets`), discard all of the changes Rush generated for the other packages.
   Make sure to revert the version number(s) for those packages you do not intend to update in the dependencies/devDependencies
   of the `package.json` for the package you are updating.

Once your PR is merged:

- Schedule a [Prod build] from the `main` branch.
- Once the build is complete, schedule a [Prod npm release] from that build.
  You may need to get an approval for the release from the appropriate Azure SDK EngSys team members.
- Note that sometimes the npm release may report failure even when it succeeded. This is because sometimes it tries to
  publish package twice and succeeds only on the first try.
- Verify the release worked by new versions of the appropriate packages being released to npm.
  See [README `packages` section]. You can also look at the release build log.

**IMPORTANT**: Changes to the AutoRest extension package, used by Production LintDiff,  require additional code
  updates to `openapi-alps` ADO repository, and deployment of them. Work with this tool owner to apply these steps.
  Example of such past deployment is given [here](https://github.com/Azure/azure-sdk-tools/issues/6071#issuecomment-1530128107),
  with [this PR](https://devdiv.visualstudio.com/DevDiv/_git/openapi-alps/pullrequest/468946?_a=files)
  updating the `LINT_VERSION` value.

## Verify the deployed changes

If the changes you deployed include changes to the Spectral ruleset, you can verify the changes got deployed by following
the guidance given in `How to verify which Spectral rules are running in Production and Staging LintDiff`.

# How to locally reproduce a LintDiff failure occurring on a PR

This section explains how to locally reproduce a LintDiff failure in one of the PRs
submitted to [azure-rest-api-specs](https://github.com/Azure/azure-rest-api-specs)
or [azure-rest-api-specs-pr](https://github.com/Azure/azure-rest-api-specs-pr) repos.

Reproducing failure locally allows you to locally iterate on your spec changes
and keep rerunning LintDiff quickly until it passes.

LintDiff is running as an extension of the `autorest` command and the npm package name of LintDiff is 
[`@microsoft.azure/openapi-validator`].
As such, you can reproduce the failure locally by running following command:

```bash
autorest --v3 --spectral --azure-validator --use=@microsoft.azure/openapi-validator@<version-tag> --tag=<api-version> <path-to-autorest-config-file>
```

where:

- You must install locally the **correct version** of the `autorest` command. See `How to install AutoRest` below for details.
- You must clone locally your PR git branch. The path to your local clone will be the prefix of `<path-to-autorest-config-file>`.
- You can obtain `<version-tag>`, `<api-version>` and suffix of `<path-to-autorest-config-file>`, relative to your local
clone, from the runtime build log of the LintDiff check that failed your PR. See `How to obtain PR LintDiff check
AutoRest command invocation details` below for details and examples.

Note that once you execute the command, it may take over a minute before anything is output to the console.

## How to install AutoRest

[Install AutoRest using npm](https://github.com/Azure/autorest/blob/main/docs/install/readme.md)

```bash
# Depending on your configuration you may need to be elevated or root to run this. (on OSX/Linux use 'sudo' )
npm install -g autorest@<currently_used_version>
# run using command 'autorest' to check if installation worked
autorest --help
```

Note that as of 6/5/2023 the exact `<currently_used_version>` of AutoRest by the LintDiff pipelines is [3.6.1](https://devdiv.visualstudio.com/DevDiv/_git/openapi-alps?path=/common/config/rush/pnpm-lock.yaml&version=GCbd88a10303709fd617f57b914671647d4ca63eb8&line=109&lineEnd=109&lineStartColumn=13&lineEndColumn=18&lineStyle=plain&_a=contents).
You can install it with `npm install -g autorest@3.6.1`.

## How to obtain PR LintDiff check AutoRest command invocation details

Using [PR 24311] as an example, we will determine what is the exact AutoRest command invocation used both by the
production LintDiff check of `Swagger LintDiff`, and the staging LintDiff check of `~[Staging] Swagger LintDiff`.

### Production LintDiff CI check

To determine the production LintDiff check (`Swagger LintDiff`) AutoRest command invocation for the [PR 24311] (our example), follow these steps:

- Open the [PR 24311] page.
- Click on [`Checks`](https://github.com/Azure/azure-rest-api-specs/pull/24311/checks) and expand `openapi-pipeline-app`.
- Click on [`Swagger LintDiff`](https://github.com/Azure/azure-rest-api-specs/pull/24311/checks?check_run_id=14029092663).
  - Observe the page says `compared tags (via openapi-validator `[`v2.1.2`](https://www.npmjs.com/package/@microsoft.azure/openapi-validator/v/2.1.2)`)`, which foreshadows what we are looking for.
- Click on [`View more details on Swagger Pipeline`](https://dev.azure.com/azure-sdk//internal/_build/results?buildId=2824970&view=logs&j=0574a2a6-2d0a-5ec6-40e4-4c6e2f70bea2).
- Expand the `LintDiff` job and click on the [`LintDiff` task](https://dev.azure.com/azure-sdk/internal/_build/results?buildId=2824970&view=logs&j=0574a2a6-2d0a-5ec6-40e4-4c6e2f70bea2&t=80c3e782-49f0-5d1c-70dd-cbee57bdd0c7).
- Observe the line: [`Executing: node /mnt/vss/_work/_tasks/AzureApiValidation_5654d05d-82c1-48da-ad8f-161b817f6d41/0.0.54/private/azure-swagger-validation/azureSwaggerValidation/node_modules/autorest/dist/app.js --v3 --spectral --azure-validator --semantic-validator=false --model-validator=false --message-format=json --openapi-type=arm --use=@microsoft.azure/openapi-validator@2.1.2 --tag=package-2023-07 /mnt/vss/_work/1/azure-rest-api-specs/specification/deviceupdate/resource-manager/readme.md`](https://dev.azure.com/azure-sdk/internal/_build/results?buildId=2824970&view=logs&j=0574a2a6-2d0a-5ec6-40e4-4c6e2f70bea2&t=80c3e782-49f0-5d1c-70dd-cbee57bdd0c7&l=59)
  - Here, `node /mnt/vss/_work/_tasks/AzureApiValidation_5654d05d-82c1-48da-ad8f-161b817f6d41/0.0.54/private/azure-swagger-validation/azureSwaggerValidation/node_modules/autorest/dist/app.js` corresponds to the command `autorest`.
  - Observe the line has, using the variables from `How to locally reproduce a LintDiff failure occurring on a PR`:
    - `<version-tag>` of `2.1.2`,
    - `<api-version>` of `package-2023-07`,
    - and `<path-to-autorest-config-file>` of `/mnt/vss/_work/1/azure-rest-api-specs/specification/deviceupdate/resource-manager/readme.md`.
      - You must replace `/mnt/vss/_work/1/azure-rest-api-specs/` with your local repo clone path for local execution.

As a result, this information can be used to build the following example local execution command, using the template from `How to locally reproduce a LintDiff failure occurring on a PR`:

``` bash
autorest --v3 --spectral --azure-validator --use=@microsoft.azure/openapi-validator@2.1.2 --tag=package-2023-07 /path_to_local_specs_repo_clone/specification/deviceupdate/resource-manager/readme.md
```

   > **Troubleshooting**: if you get `error   | [Exception] No input files provided.` and you are positive the `<path-to-autorest-config-file>` is correct, then please:
   > - double check you have cloned the correct repo (fork, if applicable)
   > - double check your clone has the correct branch checked out
   > - ensure the `<version-tag>` you used exists within the file.

### Staging LintDiff CI check

The process for determining the command for `~[Staging] Swagger LintDiff` is the same, as explained in
`Production LintDiff CI check`, except:

- You must drill down into `~[Staging] Swagger LintDiff` check instead of `Swagger LintDiff`.
- The AutoRest invocation will be slightly different. Here: [`Executing: npx autorest --v3 --version:next --spectral --validation --azure-validator --semantic-validator=false --model-validator=false --message-format=json --openapi-type=arm --use=@microsoft.azure/openapi-validator@beta --tag=package-2023-07 /mnt/vss/_work/1/azure-rest-api-specs/specification/deviceupdate/resource-manager/readme.md`](https://dev.azure.com/azure-sdk/internal/_build/results?buildId=2824971&view=logs&j=688669d0-441c-57c3-cf6d-f89a22ccfa5d&t=b91b1e88-b042-5e18-36d8-34e4fb3a9b3b&l=60)
- You should expect exactly the same command, with one difference: for staging, the `<version-tag>`
  is always going to be `beta`.

# How to run LintDiff locally from sources

To run LintDiff locally from sources, you should follow the guidance given in
`How to locally reproduce a LintDiff failure occurring on a PR`
but with one major difference: instead of passing as `--use=` the value of `@microsoft.azure/openapi-validator@<version-tag>`, you will point to your local LintDiff installation.

This will allow you to not only reproduce any failures occurring in the CI, but also rapidly iterate changes to LintDiff
itself.

Steps:

1. Ensure you meet the [`How to prepare for a PR submission after you made changes locally`](#how-to-prepare-for-a-pr-submission-after-you-made-changes-locally) requirements **up to and including** `rush build`.
1. Prepare the `autorest` invocation command as described in `How to locally reproduce a LintDiff failure occurring on a PR`,
but instead of `--use=@microsoft.azure/openapi-validator@<version-tag>` use `--use=./packages/azure-openapi-validator/autorest`, where `.` denotes path to your local clone of [`azure-openapi-validator` repository](https://github.com/Azure/azure-openapi-validator).

   > **Troubleshooting**: if you get `error   |   Error: Can only create file URIs from absolute paths. Got 'packages\azure-openapi-validator\autorest\readme.md'` then ensure you passed `--use=./packages/azure-openapi-validator/autorest` and not `--use=packages/azure-openapi-validator/autorest`.

# How to set a Spectral rule to run only in staging

1. Given a Spectral rule definition. e.g. [ProvisioningStateSpecifiedForLROPut in az-arm.ts](https://github.com/Azure/azure-openapi-validator/blob/225d507ede59ab5371dd84328422c9f525dca21c/packages/rulesets/src/spectral/az-arm.ts#LL82C5-L82C40),
you can disable it from running in production by adding `stagingOnly: true` property.
Don't forget to add a comma at the end!
   - The rules are disabled only for production runs. Staging LintDiff runs always run all enabled Spectral rules.
   - For an example of few rules being set to `stagingOnly`, see [this file diff](https://github.com/Azure/azure-openapi-validator/pull/506/files#diff-4c1382203db84bcd9df61a5bbf90823d0e1f39a833e8eaa1a5be96ca4a4e9b61).
2. Follow the instructions given in the [`How to deploy your changes`](#how-to-deploy-your-changes) section.

To re-enable the rule for production runs, delete the property and re-deploy the rule.

If you want to completely disable a rule then change its severity to `"off"`.

# How to verify which Spectral rules are running in Production and Staging LintDiff

You can look at the relevant build logs, as they output list of running Spectral rules, and if they are disabled.

- An example for [Production LintDiff run](https://dev.azure.com/azure-sdk/internal/_build/results?buildId=2773189&view=logs&j=0574a2a6-2d0a-5ec6-40e4-4c6e2f70bea2&t=80c3e782-49f0-5d1c-70dd-cbee57bdd0c7&l=88).
- An example for [Staging LintDiff run](https://dev.azure.com/azure-sdk/internal/_build/results?buildId=2773190&view=logs&j=688669d0-441c-57c3-cf6d-f89a22ccfa5d&t=b91b1e88-b042-5e18-36d8-34e4fb3a9b3b&l=89).

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

[PR 24311]: https://github.com/Azure/azure-rest-api-specs/pull/24311/
[`@microsoft.azure/openapi-validator`]: https://www.npmjs.com/package/@microsoft.azure/openapi-validator?activeTab=versions

[Staging build]: https://dev.azure.com/azure-sdk/internal/_build?definitionId=5797&_a=summary  
[Prod build]: https://dev.azure.com/azure-sdk/internal/_build?definitionId=1580&_a=summary
[Staging npm release]: https://dev.azure.com/azure-sdk/internal/_release?_a=releases&view=mine&definitionId=108  
[Prod npm release]: https://dev.azure.com/azure-sdk/internal/_release?_a=releases&view=mine&definitionId=80
[README `packages` section]: https://github.com/Azure/azure-openapi-validator#packages  
