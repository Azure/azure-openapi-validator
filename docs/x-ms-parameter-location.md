# XmsParameterLocation
## Description
An Open API Document has a section for parameters. Any parameter that is defined in this (global) parameters section will be treated as client parameters(by autorest). So, the service teams must be absolutely sure that this is the expectation (i.e. defining them as client properties) before defining the parameters in this section. 

90% scenario is that subscriptionId and api-version are parameters that should be defined in the global parameters section.

However, one can define a parameter that is being referenced in multiple operations (example: resourceGroupName) in the global parameters section and apply the extension "x-ms-parameter-location": "method". This will then not be a client property.

So, when you define a parameter in the global parameters section, apply the extension "x-ms-parameter-location": "method" so this will not be treated as a client property. But, if you actually want the parameter to be client properties then apply the extension "x-ms-parameter-location": "client".

## How to fix
Apply "x-ms-parameter-location": "method"/"x-ms-parameter-location": "client" on the global parameters (based on your requirements)

## Reference
Refer [Link](https://github.com/Azure/autorest/blob/master/docs/extensions/readme.md#x-ms-parameter-location) for further details.