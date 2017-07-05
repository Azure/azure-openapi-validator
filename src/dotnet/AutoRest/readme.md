# Classic CSharp Azure OpenAPI validator

Classic Azure OpenAPI validator (CSharp)

## Validation

``` yaml
pipeline:
  swagger-document/azure-validator:
    input: swagger-document/identity
    scope: azure-validator-composed
  swagger-document/individual/azure-validator:
    input: swagger-document/individual/identity
    scope: azure-validator-individual
  
  # validator written in CSharp
  swagger-document/classic-openapi-validator:
    input:
       - swagger-document/identity
       - azure-validator # artificial predecessor in order to ensure order of messages for CI purposes
  swagger-document/individual/classic-openapi-validator:
    input: 
       - swagger-document/identity
       - azure-validator # artificial predecessor in order to ensure order of messages for CI purposes
```

