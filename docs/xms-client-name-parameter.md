# XmsClientNameParameter

## Description

The [`x-ms-client-name`](https://github.com/Azure/autorest/tree/master/docs/extensions#x-ms-client-name) extension is used to change the name of a parameter or property in the generated code. By using the 'x-ms-client-name' extension, a name can be defined for use specifically in code generation, separately from the name on the wire. It can be used for query parameters and header parameters, as well as properties of schemas. This name is case sensitive.

## Why?

This value cannot be same as parameter name or property name, because having the same name invalidates the usage.

## How to fix

Please specify non-empty x-ms-client-name, different from the model/property name that you'd like to be generated.

## Impact on generated code

Generated SDK code will expose the corresponding client name on property or model.
