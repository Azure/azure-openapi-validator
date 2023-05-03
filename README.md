# azure-openapi-validator

For a deep-dive on this tool, please see https://aka.ms/lintdiff.

`azure-openapi-validator`, aka `LintDiff`, is a linter for Azure OpenAPI specifications.
It is an extension of [autorest](https://github.com/Azure/autorest) and supports [spectral](https://github.com/stoplightio/spectral)
lint rule format. This repo also contains all the automated linter rules that apply to the API specs in the
[azure-rest-api-specs](https://github.com/Azure/azure-rest-api-specs).

## Executed validation rules

Please refer to [rules.md](./docs/rules.md).

## Contributing

- If you want to submit a new rule request or bug, please file an [issue](https://github.com/Azure/azure-sdk-tools). Prefix the title with `[LintDiff]`.

- If you want to submit changes to this repository, including contributing new linter rules, check out [CONTRIBUTING.md](./CONTRIBUTING.md).

## Submitting PRs, building, testing, running locally

Please see the `Contributing` section above.

## Packages

| Name                                            | Latest                                                                                                                            |
| ----------------------------------------------- |---------------------------------------------------------------------------------------------------------------------------------- |
| AutoRest extension
| [openapi-validator][openapi-validator-src] | ![](https://img.shields.io/npm/v/@microsoft.azure/openapi-validator) https://www.npmjs.com/package/@microsoft.azure/openapi-validator |
| core functionality
|[openapi-validator-core][openapi-validator-core-src] |![](https://img.shields.io/npm/v/@microsoft.azure/openapi-validator-core) https://www.npmjs.com/package/@microsoft.azure/openapi-validator-core |
| ruleset
|[openapi-validator-rulesets][openapi-validator-rulesets-src]|![](https://img.shields.io/npm/v/@microsoft.azure/openapi-validator-rulesets) https://www.npmjs.com/package/@microsoft.azure/openapi-validator-rulesets |

[openapi-validator-src]: packages/packages/azure-openapi-validator/autorest
[openapi-validator-core-src]: packages/azure-openapi-validator/core
[openapi-validator-rulesets-src]: packages/rulesets

## Troubleshooting

There is no troubleshooting guide available at this time.
