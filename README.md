# azure-openapi-validator

azure-openapi-validator is linter for azure openapi specifications, it's a plugin of autorest and support spectral lint rules.
This repo also contains all the automated linter rules that apply to swaggers in the [azure-rest-api-sepcs](https://github.com/Azure/azure-rest-api-specs).
## packages

| Name                                            | Changelog                    | Latest                                                                                                                             |
| ----------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| autorest plugin
|[openapi-validator][openapi-validator-src]|| | ![](https://img.shields.io/npm/v/@microsoft.azure/openapi-validator)](https://www.npmjs.com/package/@microsoft.azure/openapi-validator) |
| core functionality
|[openapi-validator-core][openapi-validator-core-src]| | |![](https://img.shields.io/npm/v/@microsoft.azure/openapi-validator-core)](https://www.npmjs.com/package/@microsoft.azure/openapi-validator-core) |
|[openapi-validator-rulesets][openapi-validator-rulesets-src]| | |![](https://img.shields.io/npm/v/@microsoft.azure/openapi-validator-rulsets)](https://www.npmjs.com/package/@microsoft.azure/openapi-validator-rulesets) |


[openapi-validator-src]: packages/packages/azure-openapi-validator/autorest
[openapi-validator-core-src]: packages/azure-openapi-validator/core
[openapi-validator-rulesets-src]: packages/rulesets

## Usage

using the autorest to run the linter

```bash
autorest --v3 --azure-validator [--tag=<readme tag>] <path-to-readme>
or
autorest --v3 --azure-validator --input-file=<path-to-swagger>
```

## Troubleshooting

[See common issues here](./troubleshooting.md)