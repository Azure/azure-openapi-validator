# Azure Rules

There are a number of rules that can be validated with azure openapi validator, they are focused with Azure API specs ( ARM and/or Dataplane).

## Rules

### AnonymousParameterTypes

This rule appears when you define a model type inline, rather than in the `definitions` section. Since code generation does not have a name to call your model, the class will have a non-descriptive name. Additionally, if it represents the same type as another parameter in a different operation, then it becomes impossible to reuse that same class for both operations.

Please refer to [anonymous-parameter-types.md](./anonymous-parameter-types.md) for details.

### AvoidNestedProperties

This rule appears when you define a property with the name `properties`, and do not use the [`x-ms-client-flatten` extension](../../extensions/readme.md#x-ms-client-flatten). Users often provide feedback that they don't want to create multiple levels of properties to be able to use an operation. By applying the `x-ms-client-flatten` extension, you move the inner `properties` to the top level of your definition.

Please refer to [avoid-nested-properties.md](./avoid-nested-properties.md) for details.

### BodyPropertiesNamesCamelCase

This violation is flagged if a request body parameter's property name (BodyPropertiesNamesCamelCase)  is not in `camelCase` format. This is because the model's properties are sent across the wire and must adhere to common Json conventions for naming. This implies that every property name must start with a lower cased letter and all subsequent words within the name must start with a capital letter. In cases where there are acronyms involved, a maximum of three contiguous capital letters are allowed (acronyms should not be longer that 2 characters - see https://msdn.microsoft.com/en-us/library/141e06ef(v=vs.71).aspx, third upper case could be start of next word). Eg: `redisCache`, `publicIPAddress`, `location` are valid, but `sampleSQLQuery` is not (must be renamed as `sampleSqlQuery`).

Please refer to [body-properties-names-camel-case.md](./body-properties-names-camel-case.md) for details.

### BooleanPropertyNotRecommended

Booleans are not descriptive and make them hard to use. Instead use string enums with allowed set of values defined.

Please refer to [boolean-property.md](./boolean-property.md) for details.

### DefaultInEnum

This rule applies when the value specified by the `default` property does not appear in the `enum` constraint for a schema.

Please refer to [default-in-enum.md](./default-in-enum.md) for details.

### DefinitionsPropertiesNamesCamelCase

This violation is flagged if a model definition's property name (DefinitionsPropertiesNamesCamelCase) is not in `camelCase` format. This is because the model's properties are sent across the wire and must adhere to common Json conventions for naming. This implies that every property name must start with a lower cased letter and all subsequent words within the name must start with a capital letter. In cases where there are acronyms involved, a maximum of three contiguous capital letters are allowed (acronyms should not be longer that 2 characters - see https://msdn.microsoft.com/en-us/library/141e06ef(v=vs.71).aspx, third upper case could be start of next word). Eg: `redisCache`, `publicIPAddress`, `location` are valid, but `sampleSQLQuery` is not (must be renamed as `sampleSqlQuery`).

Please refer to [definition-properties-names-camel-case.md](./definition-properties-names-camel-case.md) for details.

### DescriptiveDescriptionRequired

This rule validates that a description property is not empty. An empty description does not provide value for customers and makes it more difficult to use the generated code as a consumer.

Please refer to [descriptive-description-required.md](./descriptive-description-required.md) for details.

### HostParametersValidation

This rule is to valiate the parameters in the 'x-ms-parameterized-host' to ensure they are following below rules:
1. If a parameter matches belows, therefore it must be called "endpoint".
    - Client level (x-ms-parameter-location: client)
    - A path component (in: path)
    - Part of a "x-ms-parametrized-host" with “useSchemePrefix: false”
    - Tagged "x-ms-skip-encoding: true"
2. If a parameter matches belows, therefore it must be typed "type:string, format:uri":
    - Client level
    - A path component
    - Part of a "x-ms-parametrized-host" with “useSchemePrefix: false”
    - Tagged "x-ms-skip-encoding: true"

Please refer to [host-parameters-validation.md](./host-parameters-validation.md) for details.

### LROStatusCodesValidation

This violation is flagged if a long-running PUT operation has a 200/201 status code specified without a response model definition. Eg:
```
"operationId": "Redis_Create",
"x-ms-long-running-operation": true,
....
"responses": {
    "201": {
        "description": ""
    },
    "200": {
        "description": ""
    }
}
```

Please refer to [lro-put-response-models.md](./lro-put-response-models.md) for details.

### ModelTypeIncomplete

AutoRest turns JSON schemas of `type: "object"` with properties into models in the generated code (i.e. class definitions in object oriented languages). Certain properties are required for generating this model, and this rule validates that they are present.

Please refer to [model-type-incomplete.md](./model-type-incomplete.md) for details.

### NonEmptyClientName

The [`x-ms-client-name` extension](../../extensions/readme.md#x-ms-client-name) is used to change the name of a parameter or property in the generated code. This value cannot be empty, because we need to use it as the identifier for a property or argument.

Please refer to [non-empty-client-name.md](./non-empty-client-name.md) for details.

### OperationDescriptionRequired

In a spec, operations can have a `description` property to provide information. This value is used in the documentation for the operation and in doc comments for methods that represent this operation in the generated code. Providing a description is necessary for generating high quality code.

Please refer to [operation-description-required.md](./operation-description-required.md) for details.

### OperationIdNounInVerb

Operation ids can be used to define operation groups by using a single underscore to separate a noun and a verb (e.g. _Users\_Get_). In the generated code, the _Noun_ becomes a property on the service client that groups _Verbs_. This provides a better interface by putting similar operations together and avoiding long lists of methods on the client.
The _Noun_ should not appear in the verb part of the operation id. Consumers of the generated code will already use the _Noun_ in their code, and having to repeat it in the method name is redundant.

Please refer to [operation-id-noun-in-verb.md](./operation-id-noun-in-verb.md) for details.

### OperationIdSingleUnderscore

Operation ids are unique identifiers for operations. AutoRest's convention is to split operation ids that have underscores in them and use the first part as the name of an operation group. Multiple underscores in an operation id are not permitted.

Please refer to [operation-id-single-underscore.md](./operation-id-single-underscore.md) for details.

### PageableOperations

This rule appears when you define a get operation, and its response schema has a property that is an array. The operation might be pageable.

Please refer to [pageable-operations.md](./pageable-operations.md) for details.

### ParameterDescriptionRequired

In a spec, parameters can have a `description` property to provide information. This value is used in the documentation for the operation and in doc comments for methods that represent this operation in the generated code. Providing a description is necessary for generating high quality code.

Please refer to [parameter-description-required.md](./parameter-description-required.md) for details.

### RequiredApiVersionParameter

This rule applies when the 'api-version' parameter is missing in any operations.

Please refer to [required-api-version-parameter.md](./required-api-version-parameter.md) for details.

### RequiredPropertiesMustExist

Any properties that are specified as required must actually exist. This rule makes sure that all property names in the `required` array are actually properties on a schema.

Please refer to [required-properties-must-exist.md](./required-properties-must-exist.md) for details.

### ResponseRequired

Each operation must define at least one response in the `responses` section.

Please refer to [response-required.md](./response-required.md) for details.

### SecurityDefinitionsStructure

Every swagger/configuration must have a security definitions section and it must adhere to the following structure:
```json
"securityDefinitions": {
    "azure_auth": {
        "type": "oauth2",
        "authorizationUrl": "https://login.microsoftonline.com/common/oauth2/authorize",
        "flow": "implicit",
        "description": "Azure Active Directory OAuth2 Flow",
        "scopes": {
            "user_impersonation": "impersonate your user account"
        }
    }
}
```

Please refer to [security-definitions-structure-validation.md](./security-definitions-structure-validation.md) for details.

### ValidFormats

The `format` property is an extendible way of providing more information about a `type` in the spec. AutoRest will generate code for formats that it does not know about (or ones that are typically used with a different type), but there will be no special handling for those values. You can see the set of formats that AutoRest supports here: [AutoRest Data Types](../guide/defining-clients-swagger.md#data-types).

Please refer to [valid-formats.md](./valid-formats.md) for details.

### XmsEnumValidation

For enum types, we should encourage authors to use the `x-ms-enum` extension and apply appropriate options. Please refer to the documentation details [x-ms-enum](https://github.com/Azure/autorest/blob/main/docs/extensions/readme.md#x-ms-enum)

Please refer to [x-ms-enum.md](./x-ms-enum.md) for details.

### XmsParameterLocation

An Open API Document has a section for parameters. Any parameter that is defined in this (global) parameters section will be treated as client parameters(by autorest). So, the service teams must be absolutely sure that this is the expectation (i.e. defining them as client properties) before defining the parameters in this section. 
90% scenario is that subscriptionId and api-version are parameters that should be defined in the global parameters section.
However, one can define a parameter that is being referenced in multiple operations (example: resourceGroupName) in the global parameters section and apply the extension "x-ms-parameter-location": "method". This will then not be a client property.
So, when you define a parameter in the global parameters section, apply the extension "x-ms-parameter-location": "method" so this will not be treated as a client property. But, if you actually want the parameter to be client properties then apply the extension "x-ms-parameter-location": "client".

Please refer to [x-ms-parameter-location.md](./x-ms-parameter-location.md) for details.

### XmsPathsInPath

The `x-ms-paths` extension is a way to overcome an OpenAPI limitation that disallows query parameters in paths. This is not desirable when a query parameter value can determine the response model type. See the [`x-ms-paths` documentation](../../extensions/readme.md#x-ms-paths) for more information on usage.
Paths defined in `x-ms-paths` should share a base path with a path defined in the regular paths section. If this regular path is omitted, then it is effectively invisible from other OpenAPI tools, since the `x-ms-paths` extension is a custom extension for AutoRest.

Please refer to [xms-paths-in-path.md](./xms-paths-in-path.md) for details.
