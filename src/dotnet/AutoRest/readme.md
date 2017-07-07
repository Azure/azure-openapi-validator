# Classic CSharp Azure OpenAPI validator

Classic Azure OpenAPI validator (CSharp)

## Validation

``` yaml
pipeline:
  swagger-document/classic-openapi-validator:
    input: swagger-document/identity
    scope: azure-validator-composed
  swagger-document/individual/classic-openapi-validator:
    input: swagger-document/individual/identity
    scope: azure-validator-individual
  
```

``` yaml
azure-validator-composed:
  merge-state: composed
azure-validator-individual:
  merge-state: individual
```

