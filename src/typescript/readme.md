# Typescript Azure OpenAPI validator

Azure OpenAPI validator (Typescript)

## Validation

``` yaml $(azure-validator)
pipeline:
  swagger-document/openapi-validator:
    input: swagger-document/identity
    scope: azure-validator-composed
  swagger-document/individual/openapi-validator:
    input: swagger-document/individual/identity
    scope: azure-validator-individual
    
```

``` yaml $(azure-validator)
azure-validator-composed:
  merge-state: composed
azure-validator-individual:
  merge-state: individual
```