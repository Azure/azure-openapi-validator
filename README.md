# azure-openapi-validator

For deep-dive on this tool, please see https://aka.ms/lintdiff.

`azure-openapi-validator`, aka `LintDiff`, is a linter for Azure OpenAPI specifications.
It is an extension of [autorest](https://github.com/Azure/autorest) and supports [spectral](https://github.com/stoplightio/spectral)
lint rule format. This repo also contains all the automated linter rules that apply to the API specs in the
[azure-rest-api-specs](https://github.com/Azure/azure-rest-api-specs).

## Executed validation rules

Please refer to [rules.md](./docs/rules.md).

## Contributing

- If you want to submit a new rule request or bug, please file an [issue](https://github.com/Azure/azure-sdk-tools). Prefix the title with `[LintDiff]`.

- If you want to submit changes tot his repository, including contributing new linter rules, check out [CONTRIBUTING.md](./CONTRIBUTING.md).

## Building, testing, running locally

Please see the `Contributing` section above.

## Packages

| Name                                            | Latest                                                                                                                            |
| ----------------------------------------------- |---------------------------------------------------------------------------------------------------------------------------------- |
| AutoRest extension
|[openapi-validator][openapi-validator-src]| ![](https://img.shields.io/npm/v/@microsoft.azure/openapi-validator)](https://www.npmjs.com/package/@microsoft.azure/openapi-validator) |
| core functionality
|[openapi-validator-core][openapi-validator-core-src] |![](https://img.shields.io/npm/v/@microsoft.azure/openapi-validator-core)](https://www.npmjs.com/package/@microsoft.azure/openapi-validator-core) |
| ruleset
|[openapi-validator-rulesets][openapi-validator-rulesets-src]|![](https://img.shields.io/npm/v/@microsoft.azure/openapi-validator-rulsets)](https://www.npmjs.com/package/@microsoft.azure/openapi-validator-rulesets) |

[openapi-validator-src]: packages/packages/azure-openapi-validator/autorest
[openapi-validator-core-src]: packages/azure-openapi-validator/core
[openapi-validator-rulesets-src]: packages/rulesets

## How to use the Spectral ruleset

### Dependencies

The Spectral ruleset requires Node version 14 or later.

### Install Spectral

`npm i @stoplight/spectral-cli -g`

### Usage

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

### Example

```bash
spectral lint -r https://raw.githubusercontent.com/Azure/azure-openapi-validator/develop/packages/rulesets/generated/spectral/az-dataplane.js petstore.yaml
```

### Using the Spectral VSCode extension

There is a [Spectral VSCode extension](https://marketplace.visualstudio.com/items?itemName=stoplight.spectral) that will run the Spectral linter on an open API definition file and show errors right within VSCode.  You can use this ruleset with the Spectral VSCode extension.

1. Install the Spectral VSCode extension from the extensions tab in VSCode.
2. Create a Spectral configuration file (`.spectral.yaml`) in the root directory of your project as shown above.
3. Set `spectral.rulesetFile` to the name of this configuration file in your VSCode settings.

Now when you open an API definition in this project, it should highlight lines with errors.
You can also get a full list of problems in the file by opening the "Problems panel" with "View / Problems".
In the Problems panel you can filter to show or hide errors, warnings, or infos.

## Troubleshooting

There is no troubleshooting guide available at this time.
