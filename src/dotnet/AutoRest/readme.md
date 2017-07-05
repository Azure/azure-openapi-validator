# Classic CSharp Azure OpenAPI validator

Classic Azure OpenAPI validator (CSharp)

## Validation

``` yaml
pipeline:
  swagger-document/classic-openapi-validator:
    input: swagger-document/identity
    scope: openapi-validator-composed
  swagger-document/individual/classic-openapi-validator:
    input: swagger-document/individual/identity
    scope: openapi-validator-individual
  
```

``` yaml
openapi-validator-composed:
  merge-state: composed
openapi-validator-individual:
  merge-state: individual
```

