# Typescript Azure OpenAPI validator

Azure OpenAPI validator (Typescript)

## Validation

``` yaml $(azure-validator) && !$(v3)
pipeline:
  swagger-document/openapi-validator:
    input: swagger-document/identity
    scope: azure-validator-composed
  swagger-document/individual/openapi-validator:
    input: swagger-document/individual/identity
    scope: azure-validator-individual
    
```

``` yaml $(azure-validator) && $(v3)
use-extension:
  "@autorest/modelerfour": "~4.15.375"

pipeline:
  swagger-document/modelerfour-consumer:
    input: modelerfour
    scope: azure-validator-composed
  modelerfour:
    input: openapi-document/multi-api/identity     # the plugin where we get inputs from
    flatten-models: true
    flatten-payloads: true
    group-parameters: true
```

``` yaml $(azure-validator)
azure-validator-composed:
  merge-state: composed
azure-validator-individual:
  merge-state: individual
```