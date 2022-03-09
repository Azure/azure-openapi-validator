# Typescript Azure OpenAPI validator

Azure OpenAPI validator (Typescript)

## Validation

``` yaml $(azure-validator) && (v3)
pipeline:
  swagger-document/openapi-validator:
    input: swagger-document/identity
    scope: azure-validator-composed 
```

``` yaml $(spectral) && (v3)
pipeline:
  swagger-document/spectral:
    input: swagger-document/identity
    scope: azure-validator-composed 
```

``` yaml $(azure-validator) || $(spectral)
azure-validator-composed:
  merge-state: composed
azure-validator-individual:
  merge-state: individual
```
