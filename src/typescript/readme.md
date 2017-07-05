# Typescript Azure OpenAPI validator

Azure OpenAPI validator (Typescript)

## Validation

``` yaml
pipeline:
  swagger-document/openapi-validator:
    input: swagger-document/identity
    scope: azure-validator-composed
  swagger-document/individual/openapi-validator:
    input: swagger-document/individual/identity
    scope: azure-validator-individual
    
```

``` yaml
openapi-validator-composed:
  merge-state: composed
openapi-validator-individual:
  merge-state: individual
```